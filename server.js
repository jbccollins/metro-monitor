import express from 'express';
// Start the server immediatly before doing anything else. This is to avoid the annoying situation
// where the initial processing/loading of railLines/railStations takes too long and the client
// proxy fails because the server has not started yet.
const app = express();
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Listening on port ${port}`));

import fetch from 'isomorphic-fetch';
import groupBy from 'lodash.groupby';
import url from 'url';
import {
  API_RAIL_STATIONS,
  API_RAIL_LINES,
  API_TRAIN_POSITIONS,
  TRAIN_POSITIONS,
  RAIL_ALERTS,
  API_RAIL_ALERTS,
  RAIL_PREDICTIONS,
  API_RAIL_PREDICTIONS,
} from './common/constants/urls';
import {
  LINE_MERGES,
} from './common/constants/lines';
import { 
  snapStations,
  snapTrains,
} from './utils';
import { railLines, railStations } from './common/data/CleanMetroData';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.log('\x1b[31m', 'You MUST provide a WMATA API key as an environment variable. e.g: "API_KEY=<####> yarn dev"');
  console.log('\x1b[33m', 'You can get your own API key here: https://developer.wmata.com/signup/`');
  process.exit(1);
}

// The API is some trash so sometimes it doesn't return every train.
const potentiallyClearedTrainITTMap = {};
const snappedStations = snapStations(railLines, railStations);
let trains = [];
let railPredictions = [];
let railAlerts = [
  /*{"IncidentID":"8F2E1A3D-8528-4C06-AA20-1594617187D1","Description":"Red Line: Trains operate every 20-25 min w/ single tracking btwn Farragut North & Judiciary Square due to scheduled track work.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0.0,"DelaySeverity":null,"IncidentType":"Alert","EmergencyText":null,"LinesAffected":"RD;OR;YL;GR;BL;SV;","DateUpdated":"2018-06-08T22:25:10"},
  {"IncidentID":"FDB0A82A-2B8D-40A5-A5CF-7686B1EBA812","Description":"Orange Line: Dunn Loring & Vienna stations are closed due to scheduled maintenance.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0,"DelaySeverity":null,"IncidentType":"Delay","EmergencyText":null,"LinesAffected":"OR;","DateUpdated":"2018-06-13T06:58:49"},
  {"IncidentID":"502D77F1-099B-4245-A5C4-25B7A3AA7D24","Description":"Orange Line: Thru Sunday's closing, buses replace trains btwn Vienna & West Falls Church due to scheduled maintenance.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0,"DelaySeverity":null,"IncidentType":"Alert","EmergencyText":null,"LinesAffected":"OR;","DateUpdated":"2018-06-09T06:56:24"},
  {"IncidentID":"602D77F1-099B-4245-A5C4-25B7A3AA7D24","Description":"Orange Line: Thru Sunday's closing, buses replace trains btwn Vienna & West Falls Church due to scheduled maintenance.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0,"DelaySeverity":null,"IncidentType":"Alert","EmergencyText":null,"LinesAffected":"OR;","DateUpdated":"2018-06-09T06:56:24"},
  {"IncidentID":"702D77F1-099B-4245-A5C4-25B7A3AA7D24","Description":"Orange Line: Thru Sunday's closing, buses replace trains btwn Vienna & West Falls Church due to scheduled maintenance.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0,"DelaySeverity":null,"IncidentType":"Alert","EmergencyText":null,"LinesAffected":"OR;","DateUpdated":"2018-06-09T06:56:24"},
*/];

const fetchTrains = async () => {
  let nextTrains = await fetch(TRAIN_POSITIONS, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
      //'Content-Type': 'application/json'
    }
  });
  nextTrains = await nextTrains.json();
  trains = snapTrains(railLines, nextTrains, trains, potentiallyClearedTrainITTMap);
};

const fetchRailAlerts = async () => {
  let res = await fetch(RAIL_ALERTS + process.env.API_KEY, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
  res = await res.json();
  railAlerts = res["Incidents"];
};

const fetchRailPredictions = async () => {
  let res = await fetch(RAIL_PREDICTIONS + process.env.API_KEY, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
  res = await res.json();
  railPredictions = res["Trains"];
};

fetchTrains();
fetchRailAlerts();
fetchRailPredictions();
setInterval(fetchTrains, 4000);
setInterval(fetchRailAlerts, 10000);
setInterval(fetchRailPredictions, 4000);

app.get(API_RAIL_STATIONS, (req, res) => {
  res.send(snappedStations);
});

app.get(API_RAIL_LINES, (req, res) => {
  res.send(railLines);
});

app.get(API_TRAIN_POSITIONS, (req, res) => {
  res.send(trains);
});

app.get(API_RAIL_ALERTS, (req, res) => {
  res.send(railAlerts);
});

app.get(API_RAIL_PREDICTIONS, (req, res) => {
  const urlParts = url.parse(req.url, true);
  const stationCodes = urlParts['query']['stationCodes'].split(',');
  let toReturn = [];
  stationCodes.forEach((code, index) => {
    const matchingStations = railPredictions.filter(({LocationCode}) => {
      return LocationCode === code;
    })
    const groupedStations = matchingStations.map(s => ({...s, UniqueGroup: index + '-' + s.Group}))
    toReturn = toReturn.concat(groupedStations);
  })
  res.send(groupBy(toReturn, 'UniqueGroup'));
});

app.use(express.static(__dirname + '/client/build'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});