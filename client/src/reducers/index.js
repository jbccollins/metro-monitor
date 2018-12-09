import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { displayMode } from "./controls";
export default history =>
  combineReducers({
    displayMode,
    router: connectRouter(history)
  });
