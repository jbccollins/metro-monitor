import express from 'express';
// Start the server immediatly before doing anything else. This is to avoid the annoying situation
// where the initial processing/loading of railLines/railStations takes too long and the client
// proxy fails because the server has not started yet.
const app = express();
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Listening on port ${port}`));

import fetch from 'isomorphic-fetch';
import {
  API_RAIL_STATIONS,
  API_RAIL_LINES,
  API_TRAIN_POSITIONS,
  TRAIN_POSITIONS,
} from './common/constants/urls';
import {
  LINE_MERGES,
} from './common/constants/lines';
import { 
  mergeLines, 
  snapStations,
  snapTrains,
} from './utils';
import { railLines, railStations } from './common/data/CleanMetroData';

// const API_KEY = process.env.API_KEY;

// if (!API_KEY) {
//   console.log('\x1b[31m', 'You MUST provide a WMATA api key as an environment variable. e.g: "API_KEY=<####> yarn dev"');
//   console.log('\x1b[33m', 'You can get one here: https://developer.wmata.com/signup/`');
//   process.exit(1);
// }

// TODO: merge lines modifies the railLines param which is not ideal
mergeLines(railLines, LINE_MERGES);
const snappedStations = snapStations(railLines, railStations);
let trains = null;

const fetchTrains = async () => {
  let nextTrains = await fetch(TRAIN_POSITIONS, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
      //'Content-Type': 'application/json'
    }
  });
  nextTrains = await nextTrains.json();
  trains = snapTrains(railLines, nextTrains, trains);
};

fetchTrains();
setInterval(fetchTrains, 4000);

app.get(API_RAIL_STATIONS, (req, res) => {
  res.send(snappedStations);
});

app.get(API_RAIL_LINES, (req, res) => {
  res.send(railLines);
});

app.get(API_TRAIN_POSITIONS, (req, res) => {
  res.send(trains);
});