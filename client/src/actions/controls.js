const SET_VISIBLE_RAIL_LINES = 'controls/SET_VISIBLE_RAIL_LINES';
const SET_SHOW_TILES = 'controls/SET_SHOW_TILES';
const SET_DISPLAY_MODE = 'controls/SET_DISPLAY_MODE';

const setVisibleRailLines = visibleRailLines => {
  return dispatch => {
    dispatch({
      type: SET_VISIBLE_RAIL_LINES,
      payload: { visibleRailLines }
    });
  };
};

const setShowTiles = showTiles => {
  return dispatch => {
    dispatch({
      type: SET_SHOW_TILES,
      payload: { showTiles }
    });
  };
};

const setDisplayMode = displayMode => {
  return dispatch => {
    dispatch({
      type: SET_DISPLAY_MODE,
      payload: { displayMode }
    });
  };
};

export {
  SET_VISIBLE_RAIL_LINES,
  SET_SHOW_TILES,
  SET_DISPLAY_MODE,
  setVisibleRailLines,
  setShowTiles,
  setDisplayMode
};
