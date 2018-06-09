import React from 'react';
import L from 'leaflet';
import {
  Map,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  LayerGroup
} from 'react-leaflet';
import CustomLayerGroup from 'components/CustomLayerGroup';
import {
  LINE_PROPERTIES,
  LINE_NAMES,
  RED,
  ORANGE,
  BLUE,
  GREEN,
  YELLOW,
  SILVER
} from 'common/constants/lines';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchTrains, fetchRailStations, fetchRailLines } from 'actions/metro';
import 'leaflet/dist/leaflet.css';
import './style.scss';
import TrainMarker from 'components/TrainMarker';
import { nearestPointOnLine, lineString, point } from '@turf/turf';

// https://github.com/PaulLeCam/react-leaflet/issues/255#issuecomment-269750542
// The webpack bundling step can't find these images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const generateLineSegment = (coords, NAME, multiIndex) => {
  let nextC = null;
  const i = typeof multiIndex !== 'undefined' ? `-${multiIndex}` : null;
  return (
    <LayerGroup key={`${NAME}${i ? i : ''}`}>
      {coords.map((c, index) => {
        if (index < coords.length - 1) {
          nextC = coords[index + 1];
        } else {
          return false;
        }
        return (
          <GeoJSON
            onEachFeature={(f, l) => {
              l.bindPopup(`${index} ${NAME}${i ? i : ''}`);
            }}
            data={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [c, nextC]
              }
            }}
            key={index}
            weight={NAME === 'yellow' ? 10 : 5}
            color={index % 2 ? LINE_PROPERTIES[NAME]['color'] : 'black'}
          />
        );
      })}
    </LayerGroup>
  );
};

const weights = [2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 5, 6, 6, 6, 6, 7, 7, 7];
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
  -0.0001,
  0,
  0,
  0
];

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
    //hilightsLayerGroup: null,
    layersNeedOrdering: true,
    leafletMapElt: false,
    zoom: 12
  };

  componentWillUpdate(nextProps, nextState) {
    const {
      railStationsLayerGroup,
      railLinesLayerGroup,
      trainsLayerGroup,
      //hilightsLayerGroup,
      layersNeedOrdering,
      leafletMapElt
    } = nextState;
    if (
      layersNeedOrdering &&
      leafletMapElt &&
      railStationsLayerGroup &&
      railLinesLayerGroup &&
      //hilightsLayerGroup &&
      trainsLayerGroup
    ) {
      this.orderLayers(nextState);
    }
  }

  componentWillMount() {
    const { fetchTrains, fetchRailStations, fetchRailLines } = this.props;
    fetchRailLines();
    fetchRailStations();
    fetchTrains();
    setInterval(fetchTrains, 5000);
  }

  orderLayers(nextState) {
    const {
      railStationsLayerGroup,
      railLinesLayerGroup,
      trainsLayerGroup
      //hilightsLayerGroup,
    } = nextState;
    this.setState({ layersNeedOrdering: false });
    //Ugh I give up. Fucking layers won't respect my ordering without at timeout.
    setTimeout(() => {
      [
        railLinesLayerGroup,
        railStationsLayerGroup
        //hilightsLayerGroup, /*trainsLayerGroup*/
      ].forEach(layerGroup => {
        layerGroup.getLayers().forEach(layer => {
          layer.bringToFront();
        });
      });
    }, 2000);
  }

  handleMapLoad = ({ target }) => {
    this.setState({ leafletMapElt: target });
  };

  // handleHilightsReady = hilightsLayerGroup => {
  //   this.setState({hilightsLayerGroup});
  // }

  handleRailStationsReady = railStationsLayerGroup => {
    this.setState({ railStationsLayerGroup });
  };

  handleRailLinesReady = railLinesLayerGroup => {
    this.setState({ railLinesLayerGroup });
  };

  handleTrainsLayerReady = trainsLayerGroup => {
    this.setState({ trainsLayerGroup });
  };

  render() {
    const { trains, railStations, railLines } = this.props;
    const { leafletMapElt, zoom } = this.state;
    return (
      <div className="MetroMap">
        <Map
          whenReady={this.handleMapLoad}
          center={[38.9072, -77.0369]}
          onZoomEnd={() => this.setState({ zoom: leafletMapElt.getZoom() })}
          zoom={zoom}>
          <TileLayer
            className="MapboxTileLayer"
            crossOrigin
            url="https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamJjY29sbGlucyIsImEiOiJjamd3dXgyengwNmZnMndsbG9nYnM0Ynh6In0.oZwMIjuVePaRgp0ibE0pZg"
          />
          {/* <CustomLayerGroup onReady={this.handleRailLinesReady}>
            {railLines &&
              railLines.features.map(f => {
                const {
                  properties: { NAME },
                  geometry: { type, coordinates }
                } = f;
                return (generateLineSegment(coordinates, NAME));
              })
            }
          </CustomLayerGroup> */}
          <CustomLayerGroup onReady={this.handleRailLinesReady}>
            {railLines &&
              [3, 2, 1].map(p => {
                const prioritizedSegments = [];
                return [RED, ORANGE, BLUE, GREEN, YELLOW, SILVER].map(name => {
                  const priorities = LINE_PROPERTIES[name]['priorities'].filter(
                    ({ priority }) => priority === p
                  );
                  const railLine = railLines.features.find(
                    ({ properties: { NAME } }) => name === NAME
                  );
                  return priorities.map(
                    ({ priority, range, lineCap }, index) => (
                      <GeoJSON
                        key={`${name}-${priority}-${index}`}
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
                        weight={priority * 4}
                        color={LINE_PROPERTIES[name]['color']}
                      />
                    )
                  );
                });
              })}
          </CustomLayerGroup>
          <CustomLayerGroup onReady={this.handleRailStationsReady}>
            {railStations &&
              railStations.map(
                ({ Code, Name, Lat, Lon, LineCode1, LineCode2, LineCode3 }) => {
                  return (
                    <CircleMarker
                      onReady={this.handleRailStationsReady}
                      key={Code}
                      radius={4}
                      color={'black'}
                      opacity={1}
                      fillOpacity={1}
                      fillColor="white"
                      center={[Lat, Lon]}>
                      <Popup>
                        <div>
                          <div>{Name}</div>
                          <div>{Code}</div>
                          <div>{LineCode1}</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                }
              )}
          </CustomLayerGroup>
          {/* <CustomLayerGroup onReady={this.handleTrainsLayerReady}>
            {trains &&
              trains.map(t => {
                const { geometry, properties } = t;
                const { TRACKLINE, ITT } = properties;
                const [Lat, Lon] = geometry['coordinates'];
                const lineProperties = Object.values(LINE_PROPERTIES).find(({ trackLineID }) => trackLineID === TRACKLINE);
                return (
                  <CircleMarker
                    onReady={this.handleTrainsLayerReady}
                    key={ITT}
                    radius={5}
                    color={lineProperties['color']}
                    opacity={1}
                    fillOpacity={1}
                    center={[Lat, Lon]}>
                    <Popup>
                      <div>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
          </CustomLayerGroup> */}
          <CustomLayerGroup onReady={this.handleTrainsLayerReady}>
            {trains &&
              trains.map(t => {
                const { geometry, properties } = t;
                const {
                  TRACKLINE,
                  ITT,
                  DEST_STATION,
                  TRIP_DIRECTION,
                  closestLineSegment
                } = properties;
                const [Lat, Lon] = geometry['coordinates'];
                const lineProperties = Object.values(LINE_PROPERTIES).find(
                  ({ trackLineID }) => trackLineID === TRACKLINE
                );
                let nearestSegmentCoords = [
                  t.properties.closestLineSegment.l.geometry.coordinates[0],
                  t.properties.closestLineSegment.l.geometry.coordinates[1]
                ];
                if (TRIP_DIRECTION === '1') {
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
                    radius={5}
                    color={lineProperties['color']}
                    rotationAngle={properties['rotationAngle']}
                    opacity={1}
                    fillOpacity={1}
                    closestLineSegment={properties['closestLineSegment']}
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
          {/* <CustomLayerGroup onReady={this.handleHilightsReady}>
            {trains && leafletMapElt &&
              trains.map((t, index) => {
                const data = {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: offsetLatLngs(
                      [
                        t.properties.closestLineSegment.l.geometry.coordinates[0].reverse(),
                        t.properties.closestLineSegment.l.geometry.coordinates[1].reverse(),
                      ],
                      leafletMapElt.getZoom()
                    )
                  }
                };
                return (
                  <GeoJSON
                    key={`${Math.random()}-${zoom}`}
                    data={data}
                    weight={10}
                    color={'pink'}
                  />
                )
              })
            }
          </CustomLayerGroup> */}
        </Map>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trains: state.trains.trains,
  railStations: state.railStations.railStations,
  railLines: state.railLines.railLines
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTrains,
      fetchRailStations,
      fetchRailLines
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MetroMap);
