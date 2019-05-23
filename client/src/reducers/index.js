import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { displayMode, data } from "./controls";
export default history =>
  combineReducers({
    displayMode,
    data,
    router: connectRouter(history)
  });
