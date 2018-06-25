const SET_MAP_POSITION = 'persistence/SET_MAP_POSITION';

const setMapPosition = mapPosition => {
  return dispatch => {
    dispatch({
      type: SET_MAP_POSITION,
      payload: { mapPosition }
    });
  };
};

export { SET_MAP_POSITION, setMapPosition };
