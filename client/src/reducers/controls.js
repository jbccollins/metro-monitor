import {
  SET_VISIBLE_RAIL_LINES,
  SET_SHOW_TILES,
  SET_DISPLAY_MODE
} from '../actions/controls';
import { LINE_NAMES } from 'common/constants/lines';
import { DARK } from 'common/constants/controls';

const initialVisibleRailLines = [].concat(LINE_NAMES);

const visibleRailLines = (state = initialVisibleRailLines, action) => {
  switch (action.type) {
    case SET_VISIBLE_RAIL_LINES:
      return action.payload.visibleRailLines;
    default:
      return state;
  }
};

const showTiles = (state = true, action) => {
  switch (action.type) {
    case SET_SHOW_TILES:
      return action.payload.showTiles;
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

export { visibleRailLines, showTiles, displayMode };
