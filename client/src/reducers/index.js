import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { displayMode } from "./controls";
export default combineReducers({
  displayMode,
  router: routerReducer
});
