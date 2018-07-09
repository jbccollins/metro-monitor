import { SET_DISPLAY_MODE } from "../actions/controls";

const displayMode = (state = "dark", action) => {
  switch (action.type) {
    case SET_DISPLAY_MODE:
      return action.payload.displayMode;
    default:
      return state;
  }
};

export { displayMode };
