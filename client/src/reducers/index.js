import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {
  trains,
  railStations,
  railLines,
  railAlerts,
  railPredictions,
  selectedRailStations,
  selectedDestinationRailStations
} from './metro';
import { visibleRailLines, showTiles, displayMode } from './controls';
import { center, zoom } from './persistence';
export default combineReducers({
  trains,
  railStations,
  railLines,
  railAlerts,
  railPredictions,
  visibleRailLines,
  selectedRailStations,
  selectedDestinationRailStations,
  showTiles,
  displayMode,
  center,
  zoom,
  router: routerReducer
});
