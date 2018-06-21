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
  router: routerReducer
});
