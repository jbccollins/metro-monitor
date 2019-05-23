import { getData } from "utilities/api";
const SET_DISPLAY_MODE = "controls/SET_DISPLAY_MODE";
const DATA_REQUESTED = "controls/DATA_REQUESTED";
const DATA_RECEIVED = "controls/DATA_RECEIVED";
const DATA_ERRORED = "controls/DATA_ERRORED";

// Simple reducer example
const setDisplayMode = displayMode => {
  return dispatch => {
    dispatch({
      type: SET_DISPLAY_MODE,
      payload: { displayMode }
    });
  };
};

// Complex reducer example
const requestData = () => ({
  type: DATA_REQUESTED
});

const receiveData = data => ({
  type: DATA_RECEIVED,
  payload: { data }
});

const handleDataError = error => ({
  type: DATA_ERRORED,
  payload: { error }
});

const fetchData = () => {
  return async dispatch => {
    try {
      dispatch(requestData());
      const res = await getData();
      dispatch(receiveData(res.data));
    } catch(e) {
      dispatch(handleDataError(e));
      console.warn(e);
    }
  };
};

export {
  DATA_ERRORED,
  DATA_RECEIVED,
  DATA_REQUESTED,
  SET_DISPLAY_MODE,
  fetchData,
  setDisplayMode,
};
