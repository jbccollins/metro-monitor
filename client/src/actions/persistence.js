const SET_MAP_POSITION = 'persistence/SET_MAP_POSITION';
const SET_LEAFLET_MAP_ELT = 'persistence/SET_LEAFLET_MAP_ELT';

const setMapPosition = mapPosition => {
  return dispatch => {
    dispatch({
      type: SET_MAP_POSITION,
      payload: { mapPosition }
    });
  };
};

const setLeafletMapElt = leafletMapElt => {
  return dispatch => {
    dispatch({
      type: SET_LEAFLET_MAP_ELT,
      payload: { leafletMapElt }
    });
  };
}

export { SET_MAP_POSITION, SET_LEAFLET_MAP_ELT, setMapPosition, setLeafletMapElt };
