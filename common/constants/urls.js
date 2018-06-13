//api.wmata.com/TrainPositions/TrainPositions?contentType=json&api_key=a9803a4a2e0d43b586ed3c0893cbede5
// https://dcmetrohero.com/apis
// https://hub.arcgis.com/datasets/ead6291a71874bf8ba332d135036fbda_58?geometry=-77.326%2C38.873%2C-76.832%2C38.966

// TF IS THIS
// https://www.wmata.com/js/datafeeds/railStationsFeed.json
// https://www.wmata.com/js/datafeeds/railLinesFeed.json


// External
const TRAIN_POSITIONS = "https://gisservices.wmata.com/gisservices/rest/services/Public/TRAIN_LOC_WMS_PUB/MapServer/0/query?f=json&where=TRACKLINE%3C%3E%20%27Non-revenue%27%20and%20TRACKLINE%20is%20not%20null&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*";
const RAIL_ALERTS = "https://api.wmata.com/Incidents.svc/json/Incidents?api_key=";
const RAIL_PREDICTIONS = "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/all?api_key=";


//https://www.wmata.com/components/stations.cfc?method=getNextTrains&StationCode=B01%2CF01&returnFormat=JSON&_=1528918594607

// Internal
const API_RAIL_STATIONS = "/api/railStations";
const API_RAIL_LINES = "/api/railLines";
const API_TRAIN_POSITIONS = "/api/trainPositions";
const API_RAIL_ALERTS = "/api/railAlerts";
const API_RAIL_PREDICTIONS = "/api/railPredictions";

export {
    RAIL_ALERTS,
    RAIL_PREDICTIONS,
    API_RAIL_STATIONS,
    API_RAIL_LINES,
    API_TRAIN_POSITIONS,
    API_RAIL_ALERTS,
    API_RAIL_PREDICTIONS,
    TRAIN_POSITIONS,
};