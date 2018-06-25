import React from 'react';
import MetroMap from 'containers/MetroMap';
import RailAlerts from 'containers/RailAlerts';
import SideMenu from 'containers/SideMenu';
import RailPredictions from 'containers/RailPredictions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import queryString from 'query-string';

import url from 'url';

import { setSelectedRailStations } from 'actions/metro';
import { setVisibleRailLines, setShowTiles } from 'actions/controls';
import { setMapPosition } from 'actions/persistence';

const STATION_CODES = 'stationCodes';
const RAIL_LINES = 'railLines';
const MAP_POSITION = 'mapPosition';

class App extends React.Component {
  constructor() {
    super();
    this.urlParsingMap = {
      [STATION_CODES]: this.parseStationCodes,
      [RAIL_LINES]: this.parseRailLines,
      [MAP_POSITION]: this.parseMapPosition
    };
  }

  componentDidMount() {
    const urlParts = url.parse(window.location.href, true);
    Object.keys(urlParts['query']).forEach(key => {
      if (this.urlParsingMap[key]) {
        this.urlParsingMap[key](urlParts['query'][key]);
      }
    });
  }

  componentDidUpdate() {
    this.buildURL();
  }

  buildURL = () => {
    let urlParamMap = {};
    const { selectedRailStations, visibleRailLines, zoom, center } = this.props;
    if (selectedRailStations) {
      urlParamMap[STATION_CODES] = selectedRailStations.join(',');
    }
    if (visibleRailLines) {
      urlParamMap[RAIL_LINES] = visibleRailLines.join(',');
    }
    if (typeof zoom !== 'undefined' && center) {
      const c = center.join(',');
      urlParamMap[MAP_POSITION] = `${c},${zoom}`;
    }
    window.history.replaceState(
      null,
      null,
      `?${queryString.stringify(urlParamMap)}`
    );
  };

  parseStationCodes = stationCodes => {
    this.props.setSelectedRailStations(stationCodes.split(','));
  };

  parseRailLines = railLines => {
    this.props.setVisibleRailLines(railLines.split(','));
  };

  parseMapPosition = mapPosition => {
    const [lat, lng, zoom] = mapPosition.split(',');
    this.props.setMapPosition({
      center: [Number(lat), Number(lng)],
      zoom: Number(zoom)
    });
  };

  render() {
    return (
      <div>
        <main>
          <SideMenu />
          <MetroMap />
          <RailAlerts />
          <RailPredictions />
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visibleRailLines: state.visibleRailLines,
  selectedDestinationRailStations: state.selectedDestinationRailStations,
  showTiles: state.showTiles,
  selectedRailStations: state.selectedRailStations,
  center: state.center,
  zoom: state.zoom
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSelectedRailStations,
      setVisibleRailLines,
      setShowTiles,
      setMapPosition
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
