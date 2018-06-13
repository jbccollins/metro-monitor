import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {
  trains,
  railStations,
  railLines,
  railAlerts,
  railPredictions,
  selectedRailStations
} from './metro';
import { visibleRailLines } from './controls';
export default combineReducers({
  trains,
  railStations,
  railLines,
  railAlerts,
  railPredictions,
  visibleRailLines,
  selectedRailStations,
  router: routerReducer
});
