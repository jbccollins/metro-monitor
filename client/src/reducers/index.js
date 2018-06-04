import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { trains, stations } from './metro';

export default combineReducers({
  trains,
  stations,
  router: routerReducer,
});
