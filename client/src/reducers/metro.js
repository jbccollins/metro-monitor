import { LINE_NAMES } from 'common/constants/lines';
import {
  OUTAGES_ERRORED,
  OUTAGES_RECEIVED,
  OUTAGES_REQUESTED,
  RAIL_ALERTS_ERRORED,
  RAIL_ALERTS_RECEIVED,
  RAIL_ALERTS_REQUESTED,
  RAIL_LINES_ERRORED,
  RAIL_LINES_RECEIVED,
  RAIL_LINES_REQUESTED,
  RAIL_PREDICTIONS_ERRORED,
  RAIL_PREDICTIONS_RECEIVED,
  RAIL_PREDICTIONS_REQUESTED,
  RAIL_STATIONS_ERRORED,
  RAIL_STATIONS_RECEIVED,
  RAIL_STATIONS_REQUESTED,
  SET_SELECTED_DESTINATION_RAIL_STATIONS,
  SET_SELECTED_RAIL_STATIONS,
  TRAINS_ERRORED,
  TRAINS_RECEIVED,
  TRAINS_REQUESTED,
} from 'actions/metro';

const initialOutagesState = {
  outages: null,
  fetching: false,
  error: false
};

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

const initialRailAlertsState = {
  railAlerts: null,
  fetching: false,
  error: false
};

const initialRailPredictionsState = {
  railPredictions: null,
  fetching: false,
  error: false
};

const outages = (state = initialOutagesState, action) => {
  switch (action.type) {
    case OUTAGES_REQUESTED:
      return {
        ...state,
        fetching: true
      };
    case OUTAGES_RECEIVED:
      return {
        ...state,
        outages: action.payload.outages,
        fetching: false,
        error: false
      };
    case OUTAGES_ERRORED:
      return {
        ...state,
        outages: null,
        fetching: false,
        error: true
      };
    default:
      return state;
  }
};

const railPredictions = (state = initialRailPredictionsState, action) => {
  switch (action.type) {
    case RAIL_PREDICTIONS_REQUESTED:
      return {
        ...state,
        fetching: true
      };
    case RAIL_PREDICTIONS_RECEIVED:
      return {
        ...state,
        railPredictions: action.payload.railPredictions,
        fetching: false,
        error: false
      };
    case RAIL_PREDICTIONS_ERRORED:
      return {
        ...state,
        railPredictions: null,
        fetching: false,
        error: true
      };
    default:
      return state;
  }
};

const railAlerts = (state = initialRailAlertsState, action) => {
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

const selectedRailStations = (state = null, action) => {
  switch (action.type) {
    case SET_SELECTED_RAIL_STATIONS:
      return action.payload.selectedRailStations;
    default:
      return state;
  }
};

const initialSelectedDestinationRailStations = {};
LINE_NAMES.forEach(name => {
  initialSelectedDestinationRailStations[name] = [];
});

const selectedDestinationRailStations = (
  state = initialSelectedDestinationRailStations,
  action
) => {
  switch (action.type) {
    case SET_SELECTED_DESTINATION_RAIL_STATIONS:
      return action.payload.selectedDestinationRailStations;
    default:
      return state;
  }
};

export {
  outages,
  railAlerts,
  railLines,
  railPredictions,
  railStations,
  selectedDestinationRailStations,
  selectedRailStations,
  trains,
};
