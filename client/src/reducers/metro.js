import {
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
  RAIL_ALERTS_ERRORED
} from '../actions/metro';

const initialTrainState = {
  trains: null,
  fetching: false,
  error: false
};

const initialRailStationState = {
  railStations: null,
  fetching: false,
  error: false
};

const initialRailLineState = {
  railLines: null,
  fetching: false,
  error: false
};

const initialRailAlerts = {
  railAlerts: null,
  fetching: false,
  error: false
};

const railAlerts = (state = initialRailAlerts, action) => {
  switch (action.type) {
    case RAIL_ALERTS_REQUESTED:
      return {
        ...state,
        fetching: true
      };
    case RAIL_ALERTS_RECEIVED:
      return {
        ...state,
        railAlerts: action.payload.railAlerts,
        fetching: false,
        error: false
      };
    case RAIL_ALERTS_ERRORED:
      return {
        ...state,
        railAlerts: null,
        fetching: false,
        error: true
      };
    default:
      return state;
  }
};

const railStations = (state = initialRailStationState, action) => {
  switch (action.type) {
    case RAIL_STATIONS_REQUESTED:
      return {
        ...state,
        fetching: true
      };
    case RAIL_STATIONS_RECEIVED:
      return {
        ...state,
        railStations: action.payload.railStations,
        fetching: false,
        error: false
      };
    case RAIL_STATIONS_ERRORED:
      return {
        ...state,
        railStations: null,
        fetching: false,
        error: true
      };
    default:
      return state;
  }
};

const trains = (state = initialTrainState, action) => {
  switch (action.type) {
    case TRAINS_REQUESTED:
      return {
        ...state,
        fetching: true
      };
    case TRAINS_RECEIVED:
      return {
        ...state,
        trains: action.payload.trains,
        fetching: false,
        error: false
      };
    case TRAINS_ERRORED:
      return {
        ...state,
        trains: null,
        fetching: false,
        error: true
      };
    default:
      return state;
  }
};

const railLines = (state = initialRailLineState, action) => {
  switch (action.type) {
    case RAIL_LINES_REQUESTED:
      return {
        ...state,
        fetching: true
      };
    case RAIL_LINES_RECEIVED:
      return {
        ...state,
        railLines: action.payload.railLines,
        fetching: false,
        error: false
      };
    case RAIL_LINES_ERRORED:
      return {
        ...state,
        railLines: null,
        fetching: false,
        error: true
      };
    default:
      return state;
  }
};

export { railLines, railStations, railAlerts, trains };
