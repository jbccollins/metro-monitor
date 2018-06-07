import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { trains, railStations, railLines } from './metro';

export default combineReducers({
  trains,
  railStations,
  railLines,
  router: routerReducer
});
