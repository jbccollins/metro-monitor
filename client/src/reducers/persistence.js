import { SET_MAP_POSITION } from 'actions/persistence';

const initialCenter = [38.9072, -77.0369];
const initialZoom = 12;

const zoom = (state = initialZoom, action) => {
  switch (action.type) {
    case SET_MAP_POSITION:
      return action.payload.mapPosition.zoom;
    default:
      return state;
  }
};

const center = (state = initialCenter, action) => {
  switch (action.type) {
    case SET_MAP_POSITION:
      return action.payload.mapPosition.center;
    default:
      return state;
  }
};

export { center, zoom };
