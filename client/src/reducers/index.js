import { combineReducers } from 'redux';
import { connectRouter } from "connected-react-router";
import {
  outages,
  railAlerts,
  railLines,
  railPredictions,
  railStations,
  selectedDestinationRailStations,
  selectedRailStations,
  trains,
} from './metro';
import {
  displayMode,
  showTiles,
  showcaseMode,
  visibleRailLines,
} from './controls';
import { center, zoom } from './persistence';

export default history =>
  combineReducers({
    center,
    displayMode,
    outages,
    railAlerts,
    railLines,
    railPredictions,
    railStations,
    router: connectRouter(history),
    selectedDestinationRailStations,
    selectedRailStations,
    showTiles,
    showcaseMode,
    trains,
    visibleRailLines,
    zoom,
  });