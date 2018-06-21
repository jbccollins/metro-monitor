import fetch from 'isomorphic-fetch';
import {
  API_RAIL_STATIONS,
  API_RAIL_LINES,
  API_TRAIN_POSITIONS,
  API_RAIL_ALERTS,
  API_RAIL_PREDICTIONS
} from 'common/constants/urls';

const TRAINS_REQUESTED = 'metro/TRAINS_REQUESTED';
const TRAINS_RECEIVED = 'metro/TRAINS_RECEIVED';
const TRAINS_ERRORED = 'metro/TRAINS_ERRORED';
const RAIL_STATIONS_REQUESTED = 'metro/RAIL_STATIONS_REQUESTED';
const RAIL_STATIONS_RECEIVED = 'metro/RAIL_STATIONS_RECEIVED';
const RAIL_STATIONS_ERRORED = 'metro/RAIL_STATIONS_ERRORED';
const RAIL_LINES_REQUESTED = 'metro/RAIL_LINES_REQUESTED';
const RAIL_LINES_RECEIVED = 'metro/RAIL_LINES_RECEIVED';
const RAIL_LINES_ERRORED = 'metro/RAIL_LINES_ERRORED';
const RAIL_ALERTS_REQUESTED = 'metro/RAIL_ALERTS_REQUESTED';
const RAIL_ALERTS_RECEIVED = 'metro/RAIL_ALERTS_RECEIVED';
const RAIL_ALERTS_ERRORED = 'metro/RAIL_ALERTS_ERRORED';
const RAIL_PREDICTIONS_REQUESTED = 'metro/RAIL_PREDICTIONS_REQUESTED';
const RAIL_PREDICTIONS_RECEIVED = 'metro/RAIL_PREDICTIONS_RECEIVED';
const RAIL_PREDICTIONS_ERRORED = 'metro/RAIL_PREDICTIONS_ERRORED';
const SET_SELECTED_RAIL_STATIONS = 'metro/SET_SELECTED_RAIL_STATIONS';
const SET_SELECTED_DESTINATION_RAIL_STATIONS =
  'metro/SET_SELECTED_DESTINATION_RAIL_STATIONS';

const setSelectedRailStations = selectedRailStations => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED_RAIL_STATIONS,
      payload: { selectedRailStations }
    });
    // clear fetched data
    if (selectedRailStations === null) {
      dispatch({
        type: RAIL_PREDICTIONS_RECEIVED,
        payload: { selectedRailStations }
      });
    }
  };
};

const setSelectedDestinationRailStations = selectedDestinationRailStations => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED_DESTINATION_RAIL_STATIONS,
      payload: { selectedDestinationRailStations }
    });
  };
};

const requestRailPredictions = () => ({
  type: RAIL_PREDICTIONS_REQUESTED
});

const receiveRailPredictions = railPredictions => ({
  type: RAIL_PREDICTIONS_RECEIVED,
  payload: { railPredictions }
});

const handleRailPredictionsError = error => ({
  type: RAIL_PREDICTIONS_ERRORED,
  payload: { error }
});

const fetchRailPredictions = stationCodes => {
  return dispatch => {
    dispatch(requestRailPredictions());
    return fetch(
      API_RAIL_PREDICTIONS + `?stationCodes=${stationCodes.join(',')}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }
    )
      .then(res => res.json())
      .then(railPredictions => {
        dispatch(receiveRailPredictions(railPredictions));
      })
      .catch(e => {
        dispatch(handleRailPredictionsError(e));
        console.warn(e);
      });
  };
};

const requestRailAlerts = () => ({
  type: RAIL_ALERTS_REQUESTED
});

const receiveRailAlerts = railAlerts => ({
  type: RAIL_ALERTS_RECEIVED,
  payload: { railAlerts }
});

const handleRailAlertsError = error => ({
  type: RAIL_ALERTS_ERRORED,
  payload: { error }
});

const fetchRailAlerts = () => {
  return dispatch => {
    dispatch(requestRailAlerts());
    return fetch(API_RAIL_ALERTS, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(railAlerts => {
        dispatch(receiveRailAlerts(railAlerts));
      })
      .catch(e => {
        dispatch(handleRailAlertsError(e));
        console.warn(e);
      });
  };
};

const requestRailLines = () => ({
  type: RAIL_LINES_REQUESTED
});

const receiveRailLines = railLines => ({
  type: RAIL_LINES_RECEIVED,
  payload: { railLines }
});

const handleRailLinesError = error => ({
  type: RAIL_LINES_ERRORED,
  payload: { error }
});

const fetchRailLines = () => {
  return dispatch => {
    dispatch(requestRailLines());
    return fetch(API_RAIL_LINES, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(railLines => {
        dispatch(receiveRailLines(railLines));
      })
      .catch(e => {
        dispatch(handleRailLinesError(e));
        console.warn(e);
      });
  };
};

const requestRailStations = () => ({
  type: RAIL_STATIONS_REQUESTED
});

const receiveRailStations = railStations => ({
  type: RAIL_STATIONS_RECEIVED,
  payload: { railStations }
});

const handleRailStationsError = error => ({
  type: RAIL_STATIONS_ERRORED,
  payload: { error }
});

const fetchRailStations = () => {
  return dispatch => {
    dispatch(requestRailStations());
    return fetch(API_RAIL_STATIONS, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(railStations => {
        dispatch(receiveRailStations(railStations));
      })
      .catch(e => {
        dispatch(handleRailStationsError(e));
        console.warn(e);
      });
  };
};

const requestTrains = () => ({
  type: TRAINS_REQUESTED
});

const receiveTrains = trains => ({
  type: TRAINS_RECEIVED,
  payload: { trains }
});

const handleTrainsError = error => ({
  type: TRAINS_ERRORED,
  payload: { error }
});

const fetchTrains = () => {
  return dispatch => {
    dispatch(requestTrains());
    return fetch(API_TRAIN_POSITIONS, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
        //'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(json => {
        dispatch(receiveTrains(json));
      })
      .catch(e => {
        dispatch(handleTrainsError(e));
        console.warn(e);
      });
  };
};

export {
  TRAINS_REQUESTED,
  TRAINS_RECEIVED,
  TRAINS_ERRORED,
  RAIL_STATIONS_REQUESTED,
  RAIL_STATIONS_RECEIVED,
  RAIL_STATIONS_ERRORED,
  RAIL_LINES_REQUESTED,
  RAIL_LINES_RECEIVED,
  RAIL_LINES_ERRORED,
  RAIL_ALERTS_REQUESTED,
  RAIL_ALERTS_RECEIVED,
  RAIL_ALERTS_ERRORED,
  RAIL_PREDICTIONS_REQUESTED,
  RAIL_PREDICTIONS_RECEIVED,
  RAIL_PREDICTIONS_ERRORED,
  SET_SELECTED_RAIL_STATIONS,
  SET_SELECTED_DESTINATION_RAIL_STATIONS,
  requestRailStations,
  receiveRailStations,
  handleRailStationsError,
  requestTrains,
  receiveTrains,
  handleTrainsError,
  requestRailLines,
  receiveRailLines,
  handleRailLinesError,
  requestRailAlerts,
  receiveRailAlerts,
  handleRailAlertsError,
  fetchTrains,
  fetchRailStations,
  fetchRailLines,
  fetchRailAlerts,
  fetchRailPredictions,
  setSelectedRailStations,
  setSelectedDestinationRailStations
};
