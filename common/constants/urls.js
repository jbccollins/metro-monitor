// External
const OUTAGES = "https://api.wmata.com/Incidents.svc/json/ElevatorIncidents?api_key=";
const RAIL_ALERTS = "https://api.wmata.com/Incidents.svc/json/Incidents?api_key=";
const RAIL_PREDICTIONS = "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/all?api_key=";
const TRAIN_POSITIONS = "https://gisservices.wmata.com/gisservices/rest/services/Public/TRAIN_LOC_WMS_PUB/MapServer/0/query?f=json&where=TRACKLINE%3C%3E%20%27Non-revenue%27%20and%20TRACKLINE%20is%20not%20null&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*";

// Internal
const API_OUTAGES = "/api/outages";
const API_RAIL_ALERTS = "/api/railAlerts";
const API_RAIL_LINES = "/api/railLines";
const API_RAIL_PREDICTIONS = "/api/railPredictions";
const API_RAIL_STATIONS = "/api/railStations";
const API_TRAIN_POSITIONS = "/api/trainPositions";
export {
    API_OUTAGES,
    API_RAIL_ALERTS,
    API_RAIL_LINES,
    API_RAIL_PREDICTIONS,
    API_RAIL_STATIONS,
    API_TRAIN_POSITIONS,
    OUTAGES,
    RAIL_ALERTS,
    RAIL_PREDICTIONS,
    TRAIN_POSITIONS,
};