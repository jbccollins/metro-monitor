import React from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, GeoJSON, Popup } from 'react-leaflet';
import CustomLayerGroup from 'components/CustomLayerGroup';
import {
  LINE_PROPERTIES,
  LINE_DRAW_ORDER,
  LINE_NAMES,
  DUPLICATE_STATION_CODES,
  STATIONS_WITH_PERMANENT_LABELS
} from 'common/constants/lines';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  fetchTrains,
  fetchRailStations,
  fetchRailLines,
  setSelectedRailStations
} from 'actions/metro';
import { setMapPosition } from 'actions/persistence';
import 'leaflet/dist/leaflet.css';
import './style.scss';
import TrainMarker from 'components/TrainMarker';
import {
  nearestPointOnLine,
  nearestPoint,
  lineString,
  point,
  featureCollection
} from '@turf/turf';
import { DCGeoJSON } from 'utilities/controls';
import { getLineNamesForStation } from 'utilities/metro.js';

// https://github.com/PaulLeCam/react-leaflet/issues/255#issuecomment-269750542
// The webpack bundling step can't find these images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

//  Workaround for 1px lines appearing in Chrome due to fractional transforms
//  and resulting anti-aliasing.
//  https://github.com/Leaflet/Leaflet/issues/3575
if (window.navigator.userAgent.indexOf('Chrome') > -1) {
  var originalInitTile = L.GridLayer.prototype._initTile;
  L.GridLayer.include({
    _initTile: function(tile) {
      originalInitTile.call(this, tile);
      var tileSize = this.getTileSize();
      tile.style.width = tileSize.x + 1 + 'px';
      tile.style.height = tileSize.y + 1 + 'px';
    }
  });
}

//const weights = [2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 5, 6, 6, 6, 6, 7, 7, 7];
const scaleMultiples = [
  -0.3,
  -0.3,
  -0.3,
  -0.2,
  -0.1,
  -0.05,
  -0.03,
  -0.015,
  -0.008,
  -0.0045,
  -0.0023,
  -0.006,
  -0.003,
  -0.0015,
  -0.0008,
  -0.0004,
  -0.0001,
  -0.00008,
  -0.00008
];
const labelSpacing = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];

const offsetLatLngs = (latLngs, zoom) => {
  const first = latLngs[0];
  const last = latLngs[latLngs.length - 1];
  let dx = first[1] - last[1];
  let dy = first[0] - last[0];
  if (dx === 0 && dy === 0) {
    // Let's avoid division by 0
    return latLngs;
  }
  const vectorLength = Math.sqrt(dx * dx + dy * dy);
  dx = dx / vectorLength;
  dy = dy / vectorLength;
  const latMult = dx;
  const lngMult = -1 * dy;
  const scaleMultiple = scaleMultiples[zoom];
  const offsetLat = scaleMultiple * latMult;
  const offsetLng = scaleMultiple * lngMult;
  const newLatLngs = latLngs.map(([lat, lng]) => {
    return [lat + offsetLat, lng + offsetLng];
  });
  return newLatLngs;
};

class MetroMap extends React.Component {
  state = {
    railStationsLayerGroup: null,
    railLinesLayerGroup: null,
    trainsLayerGroup: null,
    layersNeedOrdering: true,
    leafletMapElt: false,
    geolocating: false,
    geolocationAllowed: false
  };

  componentWillUpdate(nextProps, nextState) {
    const {
      railStationsLayerGroup,
      railLinesLayerGroup,
      trainsLayerGroup,
      layersNeedOrdering,
      leafletMapElt
    } = nextState;
    if (
      layersNeedOrdering &&
      leafletMapElt &&
      railStationsLayerGroup &&
      railLinesLayerGroup &&
      trainsLayerGroup
    ) {
      this.orderLayers(nextState);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.visibleRailLines !== this.props.visibleRailLines &&
      this.state.railLinesLayerGroup
    ) {
      this.state.railStationsLayerGroup.getLayers().forEach(layer => {
        if (layer.bringToFront) {
          layer.bringToFront();
        }
      });
    }
  }

  componentWillMount() {
    const { fetchTrains, fetchRailStations, fetchRailLines } = this.props;
    fetchRailLines();
    fetchRailStations();
    fetchTrains();
    setInterval(fetchTrains, 5000);
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted' || result.state === 'prompt') {
          this.setState({ geolocationAllowed: true });
        }
      });
    }
  }

  orderLayers(nextState) {
    const {
      railStationsLayerGroup,
      railLinesLayerGroup,
      trainsLayerGroup
    } = nextState;
    this.setState({ layersNeedOrdering: false });
    //Ugh I give up. Fucking layers won't respect my ordering without at timeout.
    setTimeout(() => {
      [railLinesLayerGroup, railStationsLayerGroup].forEach(layerGroup => {
        layerGroup.getLayers().forEach(layer => {
          if (layer.bringToFront) {
            layer.bringToFront();
          }
        });
      });
    }, 2000);
  }

  handleMapLoad = ({ target }) => {
    this.setState({ leafletMapElt: target });
  };

  handleRailStationsReady = railStationsLayerGroup => {
    this.setState({ railStationsLayerGroup });
  };

  handleRailLinesReady = railLinesLayerGroup => {
    this.setState({ railLinesLayerGroup });
  };

  handleTrainsLayerReady = trainsLayerGroup => {
    this.setState({ trainsLayerGroup });
  };

  // Select nearest station
  handleGeolocation = ({ coords }) => {
    const { latitude, longitude } = coords;
    const { railStations, visibleRailLines } = this.props;
    const visibleStations = railStations.filter(station =>
      getLineNamesForStation(station, railStations).some(name =>
        visibleRailLines.includes(name)
      )
    );
    const pointFeatureCollection = featureCollection(
      visibleStations.map(({ Lat, Lon }) => point([Lon, Lat]))
    );
    const nearest = nearestPoint(
      point([longitude, latitude]),
      pointFeatureCollection
    );
    const nearestRailStation =
      visibleStations[nearest['properties']['featureIndex']];
    this.handleStationClick(nearestRailStation['Code']);
    this.setState({ geolocating: false });
    this.state.leafletMapElt.flyTo(
      [nearestRailStation.Lat, nearestRailStation.Lon],
      13
    );
  };

  handleStationClick = stationCode => {
    const { railStations, setSelectedRailStations } = this.props;
    const { Code, StationTogether1 } = railStations.find(
      ({ Code }) => Code === stationCode
    );
    let lineCodes = [Code];
    if (StationTogether1 !== '') {
      lineCodes.push(StationTogether1);
    }
    setSelectedRailStations(lineCodes);
  };

  handleMoveEnd = () => {
    const center = this.state.leafletMapElt.getCenter();
    const mapPosition = {
      zoom: this.state.leafletMapElt.getZoom(),
      center: [center.lat, center.lng]
    };
    this.props.setMapPosition(mapPosition);
  };

  render() {
    const {
      trains,
      railStations,
      railLines,
      visibleRailLines,
      selectedDestinationRailStations,
      showTiles,
      selectedRailStations,
      zoom,
      center
    } = this.props;
    const { leafletMapElt, geolocating, geolocationAllowed } = this.state;
    let selectedRailStation = null;
    if (selectedRailStations && railStations) {
      selectedRailStation = railStations.find(
        ({ Code }) => Code === selectedRailStations[0]
      );
    }
    return (
      <div className="MetroMap">
        {'geolocation' in navigator &&
          geolocationAllowed &&
          railStations && (
            <label title="Find the nearest station to me">
              <div
                className={`geolocation-button${
                  geolocating ? ' geolocating' : ''
                }`}
                onClick={() => {
                  this.setState({ geolocating: true });
                  navigator.geolocation.getCurrentPosition(
                    this.handleGeolocation
                  );
                }}
              />
            </label>
          )}
        <Map
          minZoom={9}
          whenReady={this.handleMapLoad}
          center={center}
          onMoveEnd={this.handleMoveEnd}
          zoom={zoom}>
          {showTiles && (
            <TileLayer
              className="MapboxTileLayer"
              crossOrigin
              url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
            />
          )}
          {!showTiles && (
            <GeoJSON
              className="dc-outline"
              style={{ cursor: 'default' }}
              color="grey"
              opacity={0.5}
              fillOpacity={0}
              weight={1}
              data={DCGeoJSON}
            />
          )}
          {selectedRailStation && (
            <Marker
              position={[selectedRailStation.Lat, selectedRailStation.Lon]}
              icon={L.divIcon({
                className: `selected-station-icon`,
                iconSize: [12, 12]
              })}
            />
          )}
          <CustomLayerGroup onReady={this.handleRailLinesReady}>
            {railLines &&
              [3, 2, 1].map(p => {
                return LINE_DRAW_ORDER.filter(l =>
                  visibleRailLines.includes(l)
                ).map(name => {
                  const priorities = LINE_PROPERTIES[name]['priorities'].filter(
                    ({ priority }) => priority(visibleRailLines) === p
                  );
                  const railLine = railLines.features.find(
                    ({ properties: { NAME } }) => name === NAME
                  );
                  return priorities.map(({ range, lineCap }, index) => [
                    // non-transparent underlay. not visible.
                    <GeoJSON
                      className="line-layer"
                      key={`${name}-${p}-${index}-fake`}
                      opacity={1}
                      data={{
                        type: 'Feature',
                        geometry: {
                          type: 'LineString',
                          coordinates: railLine.geometry.coordinates.slice(
                            range[0],
                            range[1] + 2
                          )
                        }
                      }}
                      lineCap={lineCap}
                      weight={p * 4}
                      color={'#2b2b2b'}
                    />,
                    // real colored line
                    <GeoJSON
                      className="line-layer"
                      key={`${name}-${p}-${index}-real`}
                      opacity={0.6}
                      data={{
                        type: 'Feature',
                        geometry: {
                          type: 'LineString',
                          coordinates: railLine.geometry.coordinates.slice(
                            range[0],
                            range[1] + 2
                          )
                        }
                      }}
                      lineCap={lineCap}
                      weight={p * 4}
                      color={LINE_PROPERTIES[name]['color']}
                    />
                  ]);
                });
              })}
          </CustomLayerGroup>
          <CustomLayerGroup onReady={this.handleRailStationsReady}>
            {railStations &&
              railStations.map((station, index) => {
                const { Code, Name, Lat, Lon } = station;
                const lineNames = getLineNamesForStation(station, railStations);
                if (DUPLICATE_STATION_CODES.includes(Code)) {
                  return false;
                }
                if (!lineNames.some(name => visibleRailLines.includes(name))) {
                  return false;
                }
                const showLabel = false; //STATIONS_WITH_PERMANENT_LABELS.includes(Code);//(index % labelSpacing[zoom]) === 0;

                return [
                  <Marker
                    key={Code}
                    position={[Lat, Lon]}
                    onClick={() => this.handleStationClick(Code)}
                    icon={L.divIcon({
                      className: `station-icon`,
                      iconSize: [12, 12]
                    })}
                  />,
                  <Marker
                    style={{ display: showLabel ? '' : 'none' }}
                    key={`${Code}-label`}
                    position={[Lat, Lon]}
                    icon={L.divIcon({
                      className: `label-icon`,
                      iconSize: [12, 12],
                      //html: `<div class='${direction}'/>`
                      html: `
                          <div style="
                            color: white; 
                            white-space: nowrap; 
                            display: ${showLabel ? 'inline-block' : 'none'};
                            transform-origin: bottom right; 
                            transform: translate(-100%) rotate(-30deg)">
                              ${Name}
                          </div>`
                    })}
                  />
                ];
              })}
          </CustomLayerGroup>
          <CustomLayerGroup onReady={this.handleTrainsLayerReady}>
            {trains &&
              trains.map(t => {
                const { geometry, properties } = t;
                const {
                  TRACKLINE,
                  ITT,
                  DEST_STATION,
                  DESTSTATIONCODE,
                  TRIP_DIRECTION,
                  closestLineSegment
                } = properties;
                const [Lat, Lon] = geometry['coordinates'];
                const lineName = LINE_NAMES.find(
                  name => LINE_PROPERTIES[name]['trackLineID'] === TRACKLINE
                );
                if (!visibleRailLines.includes(lineName)) {
                  return false;
                }
                if (
                  selectedDestinationRailStations[lineName].length > 0 &&
                  !selectedDestinationRailStations[lineName]
                    .map(({ value }) => value)
                    .includes(DESTSTATIONCODE)
                ) {
                  return false;
                }
                const lineProperties = LINE_PROPERTIES[lineName];
                let nearestSegmentCoords = [
                  t.properties.closestLineSegment.l.geometry.coordinates[0],
                  t.properties.closestLineSegment.l.geometry.coordinates[1]
                ];
                if (TRIP_DIRECTION === '2') {
                  nearestSegmentCoords = nearestSegmentCoords.reverse();
                }
                if (lineProperties['invertGeometry']) {
                  nearestSegmentCoords = nearestSegmentCoords.reverse();
                }
                const offsetLine = lineString(
                  offsetLatLngs(nearestSegmentCoords, zoom)
                );
                const nearestOnLine = nearestPointOnLine(
                  offsetLine,
                  point([Lon, Lat])
                );
                return (
                  <TrainMarker
                    key={`${ITT}-${zoom}`}
                    color={lineProperties['color']}
                    borderColor={lineProperties['complementColor']}
                    direction={lineProperties['directions'][TRIP_DIRECTION]}
                    rotationAngle={properties['rotationAngle']}
                    opacity={1}
                    fillOpacity={1}
                    position={L.latLng([
                      nearestOnLine.geometry.coordinates[1],
                      nearestOnLine.geometry.coordinates[0]
                    ])}>
                    <Popup>
                      <div>
                        <div>Destination: {DEST_STATION}</div>
                        <div>Direction: {TRIP_DIRECTION}</div>
                        <div>{ITT}</div>
                        <div>
                          {Lat}, {Lon}
                        </div>
                      </div>
                    </Popup>
                  </TrainMarker>
                );
              })}
          </CustomLayerGroup>
        </Map>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trains: state.trains.trains,
  railStations: state.railStations.railStations,
  railLines: state.railLines.railLines,
  visibleRailLines: state.visibleRailLines,
  selectedDestinationRailStations: state.selectedDestinationRailStations,
  showTiles: state.showTiles,
  selectedRailStations: state.selectedRailStations,
  zoom: state.zoom,
  center: state.center
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTrains,
      fetchRailStations,
      fetchRailLines,
      setSelectedRailStations,
      setMapPosition
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MetroMap);
