import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import runApp from './runApp';
import bindEndpoints from './bindEndpoints';
import {
  API_RAIL_STATIONS,
  API_RAIL_LINES,
} from './common/constants/urls';
import {
  LINE_MERGES,
} from './common/constants/lines';
import { 
  mergeLines, 
  snapStations 
} from './utils';
import { railLines, railStations } from './common/data/CleanMetroData';
dotenv.config();

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.log('\x1b[31m', 'You MUST provide a WMATA api key as an environment variable. e.g: "API_KEY=<####> yarn dev"');
  console.log('\x1b[33m', 'You can get one here: https://developer.wmata.com/signup/`');
  process.exit(1);
}

// TODO: merge lines modifies the railLines param which is not ideal
mergeLines(railLines, LINE_MERGES);
const snappedStations = snapStations(railLines, railStations);

const app = express();
const DEFAULT_PORT = 5001;
const port = process.env.PORT || DEFAULT_PORT;

bindEndpoints(app); // You can remove this if you don't need any server endpoints
runApp(app, port);

app.get(API_RAIL_STATIONS, (req, res) => {
  res.send(snappedStations);
});

app.get(API_RAIL_LINES, (req, res) => {
  res.send(railLines);
});

app.use(express.static(__dirname + '/client/build'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});