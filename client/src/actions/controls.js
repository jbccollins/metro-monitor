const SET_VISIBLE_RAIL_LINES = 'controls/SET_VISIBLE_RAIL_LINES';

const setVisibleRailLines = visibleRailLines => ({
  type: SET_VISIBLE_RAIL_LINES,
  payload: { visibleRailLines }
});

export { SET_VISIBLE_RAIL_LINES, setVisibleRailLines };
