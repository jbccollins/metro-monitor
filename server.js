import {
  API_RAIL_STATIONS,
  API_RAIL_LINES,
  API_TRAIN_POSITIONS,
  TRAIN_POSITIONS,
  RAIL_ALERTS,
  API_RAIL_ALERTS,
} from './common/constants/urls';
import {
  LINE_MERGES,
} from './common/constants/lines';
import { 
  snapStations,
  snapTrains,
} from './utils';
import { railLines, railStations } from './common/data/CleanMetroData';
import fetch from 'isomorphic-fetch';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import runApp from './runApp';
import bindEndpoints from './bindEndpoints';
dotenv.config();

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.log('\x1b[31m', 'You MUST provide a WMATA api key as an environment variable. e.g: "API_KEY=<####> yarn dev"');
  console.log('\x1b[33m', 'You can get one here: https://developer.wmata.com/signup/`');
  process.exit(1);
}

const app = express();
const DEFAULT_PORT = 5001;
const port = process.env.PORT || DEFAULT_PORT;

bindEndpoints(app);
runApp(app, port);

// The API is some trash so sometimes it doesn't return every train.
const potentiallyClearedTrainITTMap = {};
const snappedStations = snapStations(railLines, railStations);
let trains = [];
let railAlerts = [
  {"IncidentID":"8F2E1A3D-8528-4C06-AA20-1594617187D1","Description":"Red Line: Trains operate every 20-25 min w/ single tracking btwn Farragut North & Judiciary Square due to scheduled track work.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0.0,"DelaySeverity":null,"IncidentType":"Alert","EmergencyText":null,"LinesAffected":"RD;","DateUpdated":"2018-06-08T22:25:10"},
  {"IncidentID":"FDB0A82A-2B8D-40A5-A5CF-7686B1EBA812","Description":"Orange Line: Dunn Loring & Vienna stations are closed due to scheduled maintenance.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0,"DelaySeverity":null,"IncidentType":"Delay","EmergencyText":null,"LinesAffected":"OR;","DateUpdated":"2018-06-09T06:58:49"},
  {"IncidentID":"502D77F1-099B-4245-A5C4-25B7A3AA7D24","Description":"Orange Line: Thru Sunday's closing, buses replace trains btwn Vienna & West Falls Church due to scheduled maintenance.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0,"DelaySeverity":null,"IncidentType":"Alert","EmergencyText":null,"LinesAffected":"OR;","DateUpdated":"2018-06-09T06:56:24"},
];


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
  //railAlerts = res["Incidents"];
};

fetchTrains();
fetchRailAlerts();
setInterval(fetchTrains, 4000);
setInterval(fetchRailAlerts, 10000);

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

app.use(express.static(__dirname + '/client/build'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});