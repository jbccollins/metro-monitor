import { combineReducers } from 'redux';
import { connectRouter } from "connected-react-router";
import {
  trains,
  railStations,
  railLines,
  railAlerts,
  railPredictions,
  selectedRailStations,
  selectedDestinationRailStations
} from './metro';
import {
  visibleRailLines,
  showTiles,
  displayMode,
  showcaseMode
} from './controls';
import { center, zoom } from './persistence';

export default history =>
  combineReducers({
    trains,
    railStations,
    railLines,
    railAlerts,
    railPredictions,
    visibleRailLines,
    selectedRailStations,
    selectedDestinationRailStations,
    showTiles,
    displayMode,
    showcaseMode,
    center,
    zoom,
    router: connectRouter(history)
  });