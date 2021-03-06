import fetch from 'isomorphic-fetch';
import groupBy from 'lodash.groupby';
import url from 'url';
import {
  API_RAIL_ALERTS,
  API_RAIL_LINES,
  API_RAIL_PREDICTIONS,
  API_RAIL_STATIONS,
  API_TRAIN_POSITIONS,
  API_OUTAGES,
  OUTAGES,
  RAIL_ALERTS,
  RAIL_PREDICTIONS,
  TRAIN_POSITIONS,
} from './common/constants/urls';
import { 
  snapStations,
  snapTrains,
} from './utils';
import { railLines, railStations } from './common/data/CleanMetroData';
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

// Allow the api endpoints to be hit from other domains
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

app.use(allowCrossDomain);
bindEndpoints(app);
runApp(app, port);

// The API is some trash so sometimes it doesn't return every train.
const potentiallyClearedTrainITTMap = {};
// TODO: Can I store the pre-snapped stations in a json file instead?
const snappedStations = snapStations(railLines, railStations);
let trains = [];
let railPredictions = [];
let railAlerts = [
  // {"IncidentID":"FDB0A82A-2B8D-40A5-A5CF-7686B1EBA812","Description":"Orange Line: Dunn Loring & Vienna stations are closed due to scheduled maintenance.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0,"DelaySeverity":null,"IncidentType":"Delay","EmergencyText":null,"LinesAffected":"OR;","DateUpdated":"2018-09-17T06:58:49"},
  // {"IncidentID":"502D77F1-099B-4245-A5C4-25B7A3AA7D24","Description":"Orange Line: Thru Sunday's closing, buses replace trains btwn Vienna & West Falls Church due to scheduled maintenance.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0,"DelaySeverity":null,"IncidentType":"Alert","EmergencyText":null,"LinesAffected":"OR;","DateUpdated":"2018-09-17T06:56:24"},
  // {"IncidentID":"8F2E1A3D-8528-4C06-AA20-1594617187D1","Description":"Literally everything except the red line is on fire.","StartLocationFullName":null,"EndLocationFullName":null,"PassengerDelay":0.0,"DelaySeverity":null,"IncidentType":"Alert","EmergencyText":null,"LinesAffected":"OR;YL;GR;BL;SV;","DateUpdated":"2018-09-16T22:25:10"}, 
];
let outages = [];

const fetchOutages = async () => {
  let res = await fetch(OUTAGES + process.env.API_KEY, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
  res = await res.json();
  outages = res["ElevatorIncidents"];
};

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
fetchOutages();
setInterval(fetchTrains, 4000);
setInterval(fetchRailAlerts, 10000);
setInterval(fetchOutages, 10000);
setInterval(fetchRailPredictions, 4000);

app.get(API_OUTAGES, (req, res) => {
  res.send(outages);
});

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
  let predictions = [];
  stationCodes.forEach((code, index) => {
    const matchingStations = railPredictions.filter(({LocationCode}) => {
      return LocationCode === code;
    })
    const groupedStations = matchingStations.map(s => ({...s, UniqueGroup: s.Group + '-' + index}))
    predictions = predictions.concat(groupedStations);
  })
  const groups = groupBy(predictions, 'UniqueGroup');
  res.send({groups, stationCodes});
});

app.use(express.static(__dirname + '/client/build'));

app.get('/splash', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/splash.html'));
});

app.get('/google28ef7306b50928cb.html', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/google28ef7306b50928cb.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});