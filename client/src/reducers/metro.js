import {
    TRAINS_REQUESTED,
    TRAINS_RECEIVED,
    TRAINS_ERRORED,
    STATIONS_REQUESTED,
    STATIONS_RECEIVED,
    STATIONS_ERRORED,
} from '../actions/metro';

const initialTrainState = {
  trains: null,
  fetching: false,
  error: false,
};

const initialStationState = {
  stations: null,
  fetching: false,
  error: false,
};

export const stations = (state = initialStationState, action) => {
  switch (action.type) {
    case STATIONS_REQUESTED:
      return {
        ...state,
        fetching: true,
      };
    case STATIONS_RECEIVED:
      return {
        ...state,
        stations: action.payload.stations,
        fetching: false,
        error: false,
      };
    case STATIONS_ERRORED:
      return {
        ...state,
        stations: null,
        fetching: false,
        error: true,
      };
    default:
      return state;
  }
};

export const trains = (state = initialTrainState, action) => {
  switch (action.type) {
    case TRAINS_REQUESTED:
      return {
        ...state,
        fetching: true,
      };
    case TRAINS_RECEIVED:
      return {
        ...state,
        trains: action.payload.trains,
        fetching: false,
        error: false,
      };
    case TRAINS_ERRORED:
      return {
        ...state,
        trains: null,
        fetching: false,
        error: true,
      };
    default:
      return state;
  }
};