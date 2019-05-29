import React from 'react';
import MetroMap from 'containers/MetroMap';
import RailAlerts from 'containers/RailAlerts';
import SideMenu from 'containers/SideMenu';
import RailPredictions from 'containers/RailPredictions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';
import flatten from 'lodash.flatten';
import ReactTooltip from 'react-tooltip';
import { DARK } from 'common/constants/controls';

import url from 'url';

import {
  setSelectedRailStations,
  setSelectedDestinationRailStations
} from 'actions/metro';
import {
  setVisibleRailLines,
  setShowTiles,
  setShowcaseMode
} from 'actions/controls';
import { setMapPosition } from 'actions/persistence';
import './index.scss';

const STATION_CODES = 'stationCodes';
const RAIL_LINES = 'railLines';
const MAP_POSITION = 'mapPosition';
const SHOW_TILES = 'showTiles';
const STATION_FILTERS = 'stationFilters';
const SHOWCASE_MODE = 'showcaseMode';

class App extends React.Component {
  state = {
    showcaseModeTimeout: null,
    showcasing: false
  };

  constructor() {
    super();
    this.urlParsingMap = {
      [STATION_CODES]: this.parseStationCodes,
      [RAIL_LINES]: this.parseRailLines,
      [MAP_POSITION]: this.parseMapPosition,
      [SHOW_TILES]: this.parseShowMapTiles,
      [STATION_FILTERS]: this.parseStationFilters,
      [SHOWCASE_MODE]: this.parseShowcaseMode
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
    const {
      selectedRailStations,
      visibleRailLines,
      zoom,
      center,
      showTiles,
      selectedDestinationRailStations,
      showcaseMode
    } = this.props;
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
    if (typeof showTiles !== 'undefined') {
      urlParamMap[SHOW_TILES] = showTiles;
    }
    if (typeof showcaseMode !== 'undefined') {
      urlParamMap[SHOWCASE_MODE] = showcaseMode;
    }
    const values = Object.keys(selectedDestinationRailStations).map(
      k => selectedDestinationRailStations[k]
    );
    if (values.some(v => v.length > 0)) {
      const stationFilters = LINE_NAMES.map(l => {
        return selectedDestinationRailStations[l].map(
          stationCode => `${LINE_PROPERTIES[l]['code']}-${stationCode}`
        );
      });
      urlParamMap[STATION_FILTERS] = flatten(stationFilters).join(',');
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
    if (railLines.length > 0) {
      this.props.setVisibleRailLines(railLines.split(','));
    }
  };

  parseMapPosition = mapPosition => {
    const [lat, lng, zoom] = mapPosition.split(',');
    this.props.setMapPosition({
      center: [Number(lat), Number(lng)],
      zoom: Number(zoom)
    });
  };

  parseShowMapTiles = showTiles => {
    this.props.setShowTiles(showTiles === 'true');
  };

  parseShowcaseMode = showcaseMode => {
    const showcase = showcaseMode === 'true';
    this.props.setShowcaseMode(showcase);
    this.setState({ showcasing: showcase });
  };

  parseStationFilters = stationFilters => {
    const parsedStationFilters = {};
    LINE_NAMES.forEach(name => {
      parsedStationFilters[name] = [];
    });
    const lineCodesAndStations = stationFilters.split(',');
    lineCodesAndStations.forEach(x => {
      const [lineCode, stationCode] = x.split('-');
      const lineName = LINE_NAMES.find(
        l => LINE_PROPERTIES[l]['code'] === lineCode
      );
      parsedStationFilters[lineName].push(stationCode);
    });
    this.props.setSelectedDestinationRailStations(parsedStationFilters);
  };

  handleMouseMove = () => {
    const { showcaseMode } = this.props;
    const { showcasing, showcaseModeTimeout } = this.state;
    if (!showcaseMode) {
      return;
    }
    clearTimeout(showcaseModeTimeout);
    const nextState = {
      showcaseModeTimeout: setTimeout(this.beginShowcasing, 2000)
    };
    if (showcasing) {
      nextState['showcasing'] = false;
    }
    this.setState(nextState);
  };

  beginShowcasing = () => {
    this.setState({ showcasing: true });
  };

  render() {
    const { displayMode, showcaseMode } = this.props;
    const { showcasing } = this.state;
    return (
      <div
        onMouseMove={this.handleMouseMove}
        className={`
          ${displayMode === DARK ? 'dark-mode' : 'light-mode'}${
          showcasing && showcaseMode ? ' showcasing' : ''
        }
        `.trim()}>
        <main>
          <ReactTooltip
            effect="solid"
            offset={{ top: 0, left: -35 }}
            place="bottom"
            border
            className="global-tooltip"
            event="click"
            globalEventOff="click"
          />
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
  zoom: state.zoom,
  displayMode: state.displayMode,
  showcaseMode: state.showcaseMode
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSelectedRailStations,
      setSelectedDestinationRailStations,
      setVisibleRailLines,
      setShowTiles,
      setMapPosition,
      setShowcaseMode
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
