import {
    LINE_NAMES,
    LINE_PROPERTIES,
} from './common/constants/lines';
import { 
    point, 
    lineString, 
    nearestPointOnLine, 
    nearestPoint, 
    featureCollection,
    pointToLineDistance,
} from '@turf/turf';
import proj4 from 'proj4';

// WMATA train coordinates are in Longitude/Latitude, WGS84. Fuck that noise tho.
const WMATA_PROJ = new proj4.Proj('EPSG:4326');
// Default Leaflet coordinates are in meters, global spherical mercators projection.
const LEAFLET_PROJ = new proj4.Proj('EPSG:3785');

const calcAngleDegrees = (p1, p2) => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

const mergeLines = (railLines, merges) => {
    let dominantLine = null;
    let subordinateLine = null;
    let subordinateStart = null;
    let subordinateEnd = null;
    let dominateMiddle = null;
    let mergeCoords = null;
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

// This ensures at animating the CSS rotation transform will spin the train
// over the shortest radius.
const normalizeAngleDiff = (a1, a2) => {
  let diff = a2 - a1;
  while (diff < -180) {
    diff += 360;
  }
  while (diff > 180) {
    diff -=360;
  }
  return diff;
};

const snapTrains = (railLines, nextTrains, currentTrains, potentiallyClearedTrainITTMap) => {
    const normalizedTrains = [];
    const snappedTrains = [];
    const currentTrainITTList = currentTrains ? currentTrains.map(({properties: {ITT}}) => ITT) : [];
    nextTrains.features.forEach(({geometry, attributes}) => {
        const { TRACKLINE } = attributes;
        const { x, y } = geometry;
        const values = LINE_NAMES.map(l => LINE_PROPERTIES[l]);
        const lineProperties = values.find(({ trackLineID }) => trackLineID === TRACKLINE);
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
    });

    // Trains can flicker in and out if sensors derp. This is to buffer for that
    // so that there isn't annoying flickering of trains on the front-end UI.
    const nextTrainITTList = normalizedTrains.map(({properties: {ITT}}) => ITT);
    currentTrainITTList.forEach(ITT => {
        if (!nextTrainITTList.includes(ITT)) {
            const pcITT = potentiallyClearedTrainITTMap[ITT];
            if (typeof pcITT !== 'undefined') {
                // A train gets three refreshes to prove it still exists
                if (pcITT < 3) {
                    potentiallyClearedTrainITTMap[ITT] = pcITT + 1;
                } else {
                    delete potentiallyClearedTrainITTMap[ITT];
                }
            } else {
                potentiallyClearedTrainITTMap[ITT] = 1;
            }
        } else {
            delete potentiallyClearedTrainITTMap[ITT];
        }
    })

    const potentiallyClearedTrains = currentTrains.filter(currTrain => {
        return Object.keys(potentiallyClearedTrainITTMap).includes(currTrain['properties']['ITT'])
    });

    LINE_NAMES.forEach(name => {
        const {geometry: {coordinates}} = railLines.features.find(({properties: {NAME}}) => NAME === name);
        const line = lineString(coordinates);
        const lineFeatureCollection = featureCollection(coordinates.map(([Lat, Lon]) => point([Lat, Lon])));
        normalizedTrains
            .concat(potentiallyClearedTrains)
            .filter(({properties: {TRACKLINE}}) => TRACKLINE === LINE_PROPERTIES[name]['trackLineID'])
            .forEach(train => {
                let [Lat, Lon] = train['geometry']['coordinates'];
                const currentTrainInstance = currentTrains.find(({properties: {ITT}}) => ITT === train['properties']['ITT']);
                // For some reason the API sometimes puts trains in the middle of the ocean :/
                // When this happens don't move the train. Leave it at it's last position.
                // If a train starts in the middle of the ocean then oh well.
                if (Lat === 0 && Lon === 0 && currentTrainITTList.includes(train['properties']['ITT'])){
                    [Lat, Lon] = currentTrainInstance['geometry']['coordinates'];
                }
                // Get the nearest point on the railLine
                const nearestOnLine = nearestPointOnLine(line, point([Lon, Lat]));
                const nearestOnLineCoords = nearestOnLine.geometry.coordinates;
                // Get the nearest point that exists within the set of coordinates that define the railLine
                const nearest = nearestPoint(point([Lon, Lat]), lineFeatureCollection);
                const {properties: {featureIndex}} = nearest;
                const closestLineSegmentCandidates = [];
                if (featureIndex > 0) {
                    closestLineSegmentCandidates.push({
                        indices: [featureIndex - 1, featureIndex],
                        l: lineString([coordinates[featureIndex - 1], coordinates[featureIndex]])
                    });
                }
                if (featureIndex < coordinates.length - 1) {
                    closestLineSegmentCandidates.push({
                        indices: [featureIndex, featureIndex + 1],
                        l: lineString([coordinates[featureIndex], coordinates[featureIndex + 1]])
                    });
                }
                let smallestDistance = Infinity;
                let smallestIndex = 0;
                closestLineSegmentCandidates.forEach(({indices, l}, index) => {
                    const dist = pointToLineDistance(point([Lon, Lat]), l);
                    if (dist < smallestDistance) {
                        smallestDistance = dist;
                        smallestIndex = index;
                    }
                })
                const closestLineSegment = closestLineSegmentCandidates[smallestIndex];

                const snappedTrain = {...train};
                snappedTrain['properties']['closestLineSegment'] = closestLineSegment; 
                snappedTrain['geometry']['coordinates'] = [
                    nearestOnLineCoords[1], 
                    nearestOnLineCoords[0]
                ];
                
                let nextRotation = calcAngleDegrees(
                    {
                        x: closestLineSegment.l.geometry.coordinates[0][1],
                        y: closestLineSegment.l.geometry.coordinates[0][0],
                    },
                    {
                        x: closestLineSegment.l.geometry.coordinates[1][1],
                        y: closestLineSegment.l.geometry.coordinates[1][0],
                    }
                );
                if (currentTrainInstance) {
                    const currentRotation = currentTrainInstance['properties']['rotationAngle'];
                    nextRotation = currentRotation - normalizeAngleDiff(nextRotation, currentRotation);
                }
                snappedTrain['properties']['rotationAngle'] = nextRotation;
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