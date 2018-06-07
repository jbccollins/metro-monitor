import express from 'express';
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

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.log('\x1b[31m', 'You MUST provide a WMATA api key as an environment variable. e.g: "API_KEY=<####> yarn dev"');
  console.log('\x1b[33m', 'You can get one here: https://developer.wmata.com/signup/`');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5001;

import { railLines, railStations } from './common/data/CleanMetroData';

// TODO: merge lines modifies the railLines param which is not ideal
mergeLines(railLines, LINE_MERGES);
const snappedStations = snapStations(railLines, railStations);

app.get(API_RAIL_STATIONS, (req, res) => {
  res.send(snappedStations);
});

app.get(API_RAIL_LINES, (req, res) => {
  res.send(railLines);
});


app.listen(port, () => console.log(`Listening on port ${port}`));
