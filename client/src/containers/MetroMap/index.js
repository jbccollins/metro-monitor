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
import { LINE_PROPERTIES } from 'common/constants/lines';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchTrains, fetchRailStations, fetchRailLines } from 'actions/metro';
import proj4 from 'proj4';
import 'leaflet/dist/leaflet.css';
import './style.scss';
import flatten from 'lodash.flatten';
import { mergeLines } from 'utilities/metro';

// https://github.com/PaulLeCam/react-leaflet/issues/255#issuecomment-269750542
// The webpack bundling step can't find these images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

// WMATA train coordinates are in Longitude/Latitude, WGS84. Fuck that noise tho.
const WMATA_PROJ = new proj4.Proj('EPSG:4326');
// Default Leaflet coordinates are in meters, global spherical mercators projection.
const LEAFLET_PROJ = new proj4.Proj('EPSG:3785');

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

class MetroMap extends React.Component {
  state = {
    railStationsLayerGroup: null,
    railLinesLayerGroup: null,
    trainsLayerGroup: null,
    layersNeedOrdering: true,
    mapLoaded: false
  };

  componentWillUpdate(nextProps, nextState) {
    const {
      railStationsLayerGroup,
      railLinesLayerGroup,
      trainsLayerGroup,
      layersNeedOrdering,
      mapLoaded
    } = nextState;
    if (
      layersNeedOrdering &&
      mapLoaded &&
      railStationsLayerGroup &&
      railLinesLayerGroup &&
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
    setInterval(fetchTrains, 4000);
  }

  orderLayers(nextState) {
    const {
      railStationsLayerGroup,
      railLinesLayerGroup,
      trainsLayerGroup
    } = nextState;
    this.setState({ layersNeedOrdering: false });
    // Ugh I give up. Fucking layers won't respect my ordering without at timeout.
    setTimeout(() => {
      [railLinesLayerGroup, railStationsLayerGroup, trainsLayerGroup].forEach(
        layerGroup => {
          layerGroup.getLayers().forEach(layer => {
            layer.bringToFront();
          });
        }
      );
    }, 1000);
  }

  handleMapLoad = () => {
    this.setState({ mapLoaded: true });
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

  render() {
    const { trains, railStations, railLines } = this.props;
    console.log(railStations);
    return (
      <div className="MetroMap">
        <Map
          whenReady={this.handleMapLoad}
          center={[38.9072, -77.0369]}
          zoom={11}>
          <TileLayer
            className="MapboxTileLayer"
            crossOrigin
            url="https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamJjY29sbGlucyIsImEiOiJjamd3dXgyengwNmZnMndsbG9nYnM0Ynh6In0.oZwMIjuVePaRgp0ibE0pZg"
          />
          <CustomLayerGroup onReady={this.handleRailLinesReady}>
            {railLines &&
              railLines.features.map(f => {
                const {
                  properties: { NAME },
                  geometry: { type, coordinates }
                } = f;
                let coords = coordinates;
                return (
                  <GeoJSON
                    key={NAME}
                    data={f}
                    weight={NAME === 'yellow' ? 10 : 5}
                    color={LINE_PROPERTIES[NAME]['color']}
                    onEachFeature={(f, l) => {
                      l.bindPopup(`${NAME}`);
                    }}
                  />
                );
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
                      radius={3}
                      color={'black'}
                      opacity={1}
                      fillOpacity={1}
                      style={{ zIndex: 1 }}
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
          <CustomLayerGroup onReady={this.handleTrainsLayerReady}>
            {trains &&
              trains.features.map(t => {
                const { geometry, attributes } = t;
                const { TRACKLINE } = attributes;
                const { x, y } = geometry;
                const lineProperties = Object.values(LINE_PROPERTIES).find(
                  ({ trackLineID }) => trackLineID === TRACKLINE
                );
                const transformedGeometry = proj4.transform(
                  LEAFLET_PROJ,
                  WMATA_PROJ,
                  [x, y]
                );
                return (
                  <CircleMarker
                    onReady={this.handleTrainsLayerReady}
                    key={attributes['ITT']}
                    style={{ zIndex: 2 }}
                    radius={5}
                    color={lineProperties['color']}
                    opacity={1}
                    fillOpacity={1}
                    center={[transformedGeometry.y, transformedGeometry.x]}>
                    <Popup>
                      <div>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </div>
                    </Popup>
                  </CircleMarker>
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
