/*
var LINE_MERGES = [
    {
        // Fort Totten through L'Enfant Plaza
        dominant: green,
        subordinate: yellow,
        dominantRange: [529, 920],
        subordinateRange: [1020, 1163],
    }
];

var yellowStart = yellow.geometry.coordinates.slice(0, 1020);
var yellowEnd = yellow.geometry.coordinates.slice(1163, yellow.length - 1);
var greenMiddle = green.geometry.coordinates.slice(529, 920).reverse();

var yellowCoords = yellowStart.concat(greenMiddle, yellowEnd);

console.log(yellowCoords);

yellow.geometry.coordinates = yellowCoords;
*/
import {
    LINE_NAMES,
    LINE_PROPERTIES,
} from './common/constants/lines';
import { point, lineString, nearestPointOnLine, nearestPoint, featureCollection } from '@turf/turf';
import proj4 from 'proj4';

// WMATA train coordinates are in Longitude/Latitude, WGS84. Fuck that noise tho.
const WMATA_PROJ = new proj4.Proj('EPSG:4326');
// Default Leaflet coordinates are in meters, global spherical mercators projection.
const LEAFLET_PROJ = new proj4.Proj('EPSG:3785');

const calcAngleDegrees = (p1, p2) => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

const offsetLatLngs = latLngs => {
    const first = latLngs[0];
    const last = latLngs[latLngs.length - 1];
    let dx = first[0] - last[0];
    let dy = first[1] - last[1];
    if(dx === 0 && dy === 0){ // Let's avoid division by 0
      return latLngs;
    }
    const vectorLength = Math.sqrt((dx*dx) + (dy*dy));
    dx = dx / vectorLength;
    dy = dy / vectorLength;
    const latMult = dx;
    const lngMult = -1 * dy;
    const offsetLat = -0.0023 * latMult;
    const offsetLng = -0.0023 * lngMult;
    const newLatLngs = latLngs.map(([lat, lng]) => {
      return [lat + offsetLat, lng + offsetLng];
    });
    return newLatLngs;
}

const mergeLines = (railLines, merges) => {
    let dominantLine = null;
    let subordinateLine = null;
    let subordinateStart = null;
    let subordinateEnd = null;
    let dominateMiddle = null;
    let mergeCoords = null;
    console.log('HELLO', merges);
    merges.forEach(({
        dominant,
        subordinate,
        dominantRange,
        subordinateRange,
        reverseDominant,
    }) => {
        dominantLine = railLines['features'].find(({properties: {NAME}}) => NAME === dominant);
        subordinateLine = railLines['features'].find(({properties: {NAME}}) => NAME === subordinate);
        subordinateStart = subordinateLine.geometry.coordinates.slice(0, subordinateRange[0]);
        subordinateEnd = subordinateLine.geometry.coordinates.slice(
            subordinateRange[1], 
            subordinateLine.geometry.coordinates.length - 1
        );
        console.log(subordinateLine);
        dominateMiddle = dominantLine.geometry.coordinates.slice(dominantRange[0], dominantRange[1]);
        if (reverseDominant) {
            dominateMiddle = dominateMiddle.reverse();
        }
        mergeCoords = subordinateStart.concat(dominateMiddle, subordinateEnd);
        subordinateLine.geometry.coordinates = mergeCoords;
    })
};

// Alter the coords of the stations points to be exactly on a railLine
const snapStations = (railLines, stations) => {
  const snappedStations = [];
  LINE_NAMES.forEach(name => {
    const {geometry: {coordinates}} = railLines.features.find(({properties: {NAME}}) => NAME === name);
    const line = lineString(coordinates);
    stations.filter(({LineCode1}) => LineCode1 === LINE_PROPERTIES[name]['code']).forEach(({Lat, Lon, ...rest}) => {
      const nearestOnLine = nearestPointOnLine(line, point([Lon, Lat]));
      snappedStations.push({
        Lat: nearestOnLine.geometry.coordinates[1],
        Lon: nearestOnLine.geometry.coordinates[0],
        ...rest,
      })
    });
  });
  return snappedStations;
}

const snapTrains = (railLines, nextTrains, currentTrains) => {
    const normalizedTrains = [];
    const snappedTrains = [];
    const currentTrainITTList = currentTrains ? currentTrains.map(({properties: {ITT}}) => ITT) : [];
    nextTrains.features.forEach(({geometry, attributes}) => {
        const { TRACKLINE } = attributes;
        const { x, y } = geometry;
        const lineProperties = Object.values(LINE_PROPERTIES).find(({ trackLineID }) => trackLineID === TRACKLINE);
        const transformedGeometry = proj4.transform(LEAFLET_PROJ, WMATA_PROJ, [x, y]);
        const trainGeojson = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [transformedGeometry.y, transformedGeometry.x]
            },
            properties: {
                ...attributes
            }
        }
        normalizedTrains.push(trainGeojson)
    })

    LINE_NAMES.forEach(name => {
        const {geometry: {coordinates}} = railLines.features.find(({properties: {NAME}}) => NAME === name);
        const line = lineString(coordinates);
        //const offsetLine = lineString(offsetLatLngs(coordinates));
        //const reversedOffsetLine = lineString(offsetLatLngs(coordinates.slice().reverse()))
        const lineFeatureCollection = featureCollection(coordinates.map(([Lat, Lon]) => point([Lat, Lon])));
        normalizedTrains
            .filter(({properties: {TRACKLINE}}) => TRACKLINE === LINE_PROPERTIES[name]['trackLineID'])
            .forEach(train => {
                const [Lat, Lon] = train['geometry']['coordinates'];
                const { TRIP_DIRECTION } = train;
                // Get the nearest point on the railLine
                const nearestOnLine = nearestPointOnLine(line, point([Lon, Lat]));
                const {properties: {index}} = nearestOnLine;
                // TODO: Pick next or previous depending on train direction.
                // For now this is to just stop trains from doing sick 360 burnouts
                let nearestOnLineCoords = nearestOnLine.geometry.coordinates;
                if (index > 0) {
                    nearestOnLineCoords = coordinates[index - 1];
                }
                // TODO: Probably gonna need to use the nearest reversed point based on offset.
                // const nearestOnOffsetLine =  nearestPointOnLine(
                //     Number(TRIP_DIRECTION) === 1 ? reversedOffsetLine : offsetLine,
                //     point([Lon, Lat])
                // );
                // Get the nearest point that exists with in the set of coordinates that define the railLine
                const nearest = nearestPoint(point([Lon, Lat]), lineFeatureCollection);
                const snappedTrain = {...train};
                snappedTrain['geometry']['coordinates'] = [
                    nearestOnLineCoords[1], 
                    nearestOnLineCoords[0]
                    // nearestOnOffsetLine.geometry.coordinates[1], 
                    // nearestOnOffsetLine.geometry.coordinates[0]
                ];
                snappedTrain['properties']['rotationAngle'] = calcAngleDegrees(
                    {
                        x: nearest['geometry']['coordinates'][1],
                        y: nearest['geometry']['coordinates'][0],
                    },
                    {
                        x: nearestOnLineCoords[1],
                        y: nearestOnLineCoords[0],
                    }
                );
                if (currentTrainITTList.includes(train['properties']['ITT'])) {
                    const currentCoordinates = currentTrains.find(({properties: {ITT}}) => ITT)['geometry']['coordinates'];                    
                    snappedTrain['properties']['lastPosition'] = currentCoordinates;
                } else {
                    snappedTrain['properties']['lastPosition'] = null;
                }
                snappedTrains.push(snappedTrain);
            });
    });
    return snappedTrains;
}

export {
    mergeLines,
    snapStations,
    snapTrains,
    calcAngleDegrees,
};