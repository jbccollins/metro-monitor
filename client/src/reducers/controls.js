import { SET_DISPLAY_MODE } from "../actions/controls";
import { DARK } from "common/constants/theme";

const displayMode = (state = DARK, action) => {
  switch (action.type) {
    case SET_DISPLAY_MODE:
      return action.payload.displayMode;
    default:
      return state;
  }
};

export { displayMode };
