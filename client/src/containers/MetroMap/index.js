import React from 'react';
import L from 'leaflet';
import { Map, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet';
import { railLines } from 'assets/data/MetroData';
import { LINE_PROPERTIES } from 'constants/lines';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  fetchTrains,
  fetchStations,
} from 'actions/metro';
import proj4 from 'proj4';
import 'leaflet/dist/leaflet.css';
import './style.scss';

// https://github.com/PaulLeCam/react-leaflet/issues/255#issuecomment-269750542
// The webpack bundling step can't find these images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// WMATA train coordinates are in Longitude/Latitude, WGS84. Fuck that noise tho.
const WMATA_PROJ = new proj4.Proj('EPSG:4326');
// Default Leaflet coordinates are in meters, global spherical mercators projection.
const LEAFLET_PROJ = new proj4.Proj('EPSG:3785');

class MetroMap extends React.Component {
  componentWillMount() {
    const { fetchTrains, fetchStations } = this.props;
    fetchStations();
    fetchTrains();
    setInterval(fetchTrains, 4000);
  }
  render() {
    const { 
      trains, 
      stations,
    } = this.props;
    if (stations) {
      console.log(stations);
    }
    return(
      <div className="MetroMap">
        <Map
          center={[38.9072, -77.0369,]} 
          zoom={11}>
          <TileLayer 
            className='MapboxTileLayer' 
            crossOrigin 
            url='https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamJjY29sbGlucyIsImEiOiJjamd3dXgyengwNmZnMndsbG9nYnM0Ynh6In0.oZwMIjuVePaRgp0ibE0pZg'/>
          {
            railLines.features.map(f => {
              const {properties: {NAME}} = f;
              return <GeoJSON data={f} key={NAME} color={LINE_PROPERTIES[NAME]['color']}/>
            })
          }
          {stations &&
            stations.map(({Code, Name, Lat, Lon, LineCode1, LineCode2, LineCode3}) => {
              return (
                <CircleMarker 
                  key={Code} 
                  radius={10}
                  color={'black'}
                  opacity={1}
                  fillOpacity={1}
                  style={{zIndex: 1}}
                  center={[Lat, Lon]}>
                  <Popup>
                    <div>{Name}</div>
                  </Popup>
                </CircleMarker>
              )
            })
          }
          {trains &&
            trains.features.map(t => {
              const { geometry, attributes } = t;
              const { TRACKLINE } = attributes;
              const {x, y} = geometry;
              const lineProperties = Object.values(LINE_PROPERTIES).find(({trackLineID}) => trackLineID === TRACKLINE);
              const transformedGeometry = proj4.transform(LEAFLET_PROJ, WMATA_PROJ, [x, y]);
              return (
                <CircleMarker 
                  key={attributes['ITT']} 
                  style={{zIndex: 2}}
                  radius={5}
                  color={lineProperties['color']}
                  opacity={1}
                  fillOpacity={1}
                  center={[transformedGeometry.y, transformedGeometry.x]}>
                  <Popup>
                    <div>A pretty CSS3 popup. <br /> Easily customizable.</div>
                  </Popup>
                </CircleMarker>
              )
            })
          }
        </Map>
      </div>
    )
  }
};

const mapStateToProps = state => ({
  trains: state.trains.trains,
  stations: state.stations.stations,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTrains,
      fetchStations,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MetroMap);
