//api.wmata.com/TrainPositions/TrainPositions?contentType=json&api_key=a9803a4a2e0d43b586ed3c0893cbede5
// https://dcmetrohero.com/apis
// https://hub.arcgis.com/datasets/ead6291a71874bf8ba332d135036fbda_58?geometry=-77.326%2C38.873%2C-76.832%2C38.966
import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();

export const TRAINS_REQUESTED = 'metro/TRAINS_REQUESTED';
export const TRAINS_RECEIVED = 'metro/TRAINS_RECEIVED';
export const TRAINS_ERRORED = 'metro/TRAINS_ERRORED';
export const STATIONS_REQUESTED = 'metro/STATIONS_REQUESTED';
export const STATIONS_RECEIVED = 'metro/STATIONS_RECEIVED';
export const STATIONS_ERRORED = 'metro/STATIONS_ERRORED';

// const TRAIN_POSITIONS = "http://api.wmata.com/TrainPositions/TrainPositions?contentType=json&api_key=a9803a4a2e0d43b586ed3c0893cbede5";
const TRAIN_POSITIONS = "https://gisservices.wmata.com/gisservices/rest/services/Public/TRAIN_LOC_WMS_PUB/MapServer/0/query?f=json&where=TRACKLINE%3C%3E%20%27Non-revenue%27%20and%20TRACKLINE%20is%20not%20null&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*";
const STATION_LOCATIONS = "http://api.wmata.com/Rail.svc/json/jStations?api_key=a9803a4a2e0d43b586ed3c0893cbede5"

export const requestStations = () => ({
  type: STATIONS_REQUESTED
});

export const receiveStations = stations => ({
  type: STATIONS_RECEIVED,
  payload: { stations }
});

export const handleStationsError = error => ({
  type: STATIONS_ERRORED,
  payload: { error }
});

export function fetchStations() {
  return dispatch => {
    dispatch(requestStations());
    return fetch(STATION_LOCATIONS, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(res => res.json())
      .then(json => {
        console.log(json['Stations']);
        dispatch(receiveStations(json['Stations']));
        return json['Stations'];
      })
      .catch(error => dispatch(handleStationsError(error)));
  };
}

export const requestTrains = () => ({
  type: TRAINS_REQUESTED
});

export const receiveTrains = trains => ({
  type: TRAINS_RECEIVED,
  payload: { trains }
});

export const handleTrainsError = error => ({
  type: TRAINS_ERRORED,
  payload: { error }
});

export function fetchTrains() {
  return dispatch => {
    dispatch(requestTrains());
    return fetch(TRAIN_POSITIONS, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          //'Content-Type': 'application/json'
        },
      })
      .then(res => res.json())
      .then(json => {
        dispatch(receiveTrains(json));
        return json;
      })
      .catch(error => dispatch(handleTrainsError(error)));
  };
}