import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { trains, railStations, railLines, railAlerts } from './metro';
import { visibleRailLines } from './controls';
export default combineReducers({
  trains,
  railStations,
  railLines,
  railAlerts,
  visibleRailLines,
  router: routerReducer
});
