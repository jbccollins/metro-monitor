import { LINE_PROPERTIES, LINE_NAMES } from 'common/constants/lines';
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

const mergeLines = (lines, merges) => {
  let dominantLine = null;
  let subordinateLine = null;
  let subordinateStart = null;
  let subordinateEnd = null;
  let dominateMiddle = null;
  let mergeCoords = null;
  merges.forEach(
    ({
      dominant,
      subordinate,
      dominantRange,
      subordinateRange,
      reverseDominant
    }) => {
      dominantLine = lines['features'].find(
        ({ properties: { NAME } }) => NAME === dominant
      );
      subordinateLine = lines['features'].find(
        ({ properties: { NAME } }) => NAME === subordinate
      );
      subordinateStart = subordinateLine.geometry.coordinates.slice(
        0,
        subordinateRange[0]
      );
      subordinateEnd = subordinateLine.geometry.coordinates.slice(
        subordinateRange[0],
        subordinateLine.length - 1
      );
      dominateMiddle = dominantLine.geometry.coordinates.slice(
        dominantRange[0],
        dominantRange[1]
      );
      if (reverseDominant) {
        dominateMiddle = dominateMiddle.reverse();
      }
      mergeCoords = subordinateStart.concat(dominateMiddle, subordinateEnd);
      subordinateLine.geometry.coordinates = mergeCoords;
    }
  );
};

const getLineNamesForStation = (station, railStations) => {
  const { LineCode1, LineCode2, LineCode3, StationTogether1 } = station;
  let lineCodes = [LineCode1, LineCode2, LineCode3];
  if (StationTogether1 !== '') {
    const {
      LineCode1: stLineCode1,
      LineCode2: stLineCode2,
      LineCode3: stLineCode3
    } = railStations.find(({ Code }) => Code === StationTogether1);
    lineCodes = [].concat(lineCodes, [stLineCode1, stLineCode2, stLineCode3]);
  }
  const lineNames = lineCodes.map(c => {
    return LINE_NAMES.find(l => LINE_PROPERTIES[l]['code'] === c);
  });
  return lineNames;
};

export { mergeLines, getLineNamesForStation };
