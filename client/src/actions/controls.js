const SET_DISPLAY_MODE = "controls/SET_DISPLAY_MODE";

const setDisplayMode = displayMode => {
  return dispatch => {
    dispatch({
      type: SET_DISPLAY_MODE,
      payload: { displayMode }
    });
  };
};

export { SET_DISPLAY_MODE, setDisplayMode };
