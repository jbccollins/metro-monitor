import fetch from 'isomorphic-fetch';
import {
  API_RAIL_STATIONS,
  API_RAIL_LINES,
  API_TRAIN_POSITIONS
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
  requestRailStations,
  receiveRailStations,
  handleRailStationsError,
  requestTrains,
  receiveTrains,
  handleTrainsError,
  requestRailLines,
  receiveRailLines,
  handleRailLinesError,
  fetchTrains,
  fetchRailStations,
  fetchRailLines
};
