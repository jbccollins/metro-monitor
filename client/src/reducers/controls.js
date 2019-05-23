import {
  DATA_ERRORED,
  DATA_RECEIVED,
  DATA_REQUESTED,
  SET_DISPLAY_MODE,
} from "actions/controls";
import { DARK } from "common/constants/theme";

const initialData = {
  data: null,
  fetching: false,
  error: false
};

const data = (state = initialData, action) => {
  switch (action.type) {
    case DATA_REQUESTED:
      return {
        ...state,
        fetching: true
      };
    case DATA_RECEIVED:
      return {
        ...state,
        data: action.payload.data,
        fetching: false,
        error: false
      };
    case DATA_ERRORED:
      return {
        ...state,
        data: null,
        fetching: false,
        error: true
      };
    default:
      return state;
  }
};

const displayMode = (state = DARK, action) => {
  switch (action.type) {
    case SET_DISPLAY_MODE:
      return action.payload.displayMode;
    default:
      return state;
  }
};

export { displayMode, data };