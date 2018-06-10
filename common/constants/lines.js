const RED = 'red';
const ORANGE = 'orange';
const YELLOW = 'yellow';
const GREEN = 'green';
const BLUE = 'blue';
const SILVER = 'silver';
const LINE_NAMES = [
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    BLUE,
    SILVER,
];

const LINE_MERGES = [
    // {
    //     // Fort Totten through L'Enfant Plaza
    //     dominant: GREEN,
    //     subordinate: YELLOW,
    //     dominantRange: [529, 922],
    //     subordinateRange: [1020, 1163],
    //     reverseDominant: true
    // },
    // {
    //     dominant: ORANGE,
    //     subordinate: SILVER,
    //     dominantRange: [2690, 5617],
    //     subordinateRange: [385, 3227],
    //     reverseDominant: false,
    // },
    // {
    //     dominant: SILVER,
    //     subordinate: BLUE,
    //     dominantRange: [2254, 3547],        
    //     subordinateRange: [1326, 2517],
    //     reverseDominant: false,
    // },
    // {
    //     dominant: BLUE,
    //     subordinate: YELLOW,
    //     dominantRange: [427, 1151],
    //     subordinateRange: [56, 828],
    //     reverseDominant: false,
    // }
];

const directions = {
    1: 'forward',
    2: 'backward'
};

const invertedDirections = {
    1: 'backward',
    2: 'forward',
};

const LINE_PROPERTIES = {
    [RED]: {
        color: 'red',
        code: 'RD',
        trackLineID: 'Red',
        weight: 5,
        priorities: [
            { range: [0, 1975], priority: 3, lineCap: 'round' } // entire red line
        ],
        directions: invertedDirections,
        invertGeometry: true,
        complementColor: 'white',
    },
    [ORANGE]: {
        color: 'orange',
        code: 'OR',
        trackLineID: 'Orange',
        weight: 10,
        priorities: [
            { range: [0, 5975], priority: 3, lineCap: 'round' } // entire orange line
        ],
        directions: directions,
        invertGeometry: false,
        complementColor: 'black',
    },
    [YELLOW]: {
        color: 'yellow',
        code: 'YL',
        trackLineID: 'Yellow',
        weight: 10,
        priorities: [
            { range: [0, 55], priority: 3, lineCap: 'round' }, // only yellow
            { range: [56, 778], priority: 1, lineCap: 'butt' }, // blue > yellow
            { range: [779, 971], priority: 3, lineCap: 'round' }, // only yellow
            { range: [972, 1362], priority: 1, lineCap: 'round' }, // green > yellow
        ],
        directions: directions,
        invertGeometry: false,
        complementColor: 'black',
    },
    [GREEN]: {
        color: 'green',
        code: 'GR',
        trackLineID: 'Green',
        weight: 5,
        priorities: [
            { range: [0, 1716], priority: 3, lineCap: 'round' } // entire green line
        ],
        directions: invertedDirections,
        invertGeometry: true,
        complementColor: 'white',
    },
    [BLUE]: {
        color: 'blue',
        code: 'BL',
        trackLineID: 'Blue',
        weight: 14,
        priorities: [
            { range: [0, 1325], priority: 3, lineCap: 'round' }, // only blue as well as blue and yellow. blue > yellow.
            { range: [1326, 2382], priority: 2, lineCap: 'butt' }, // orange > blue > silver
            { range: [2383, 2617], priority: 3, lineCap: 'round' }, // blue > silver
        ],
        directions: directions,
        invertGeometry: false,
        complementColor: 'white',
    },
    [SILVER]: {
        color: 'silver',
        code: 'SV',
        trackLineID: 'Silver',
        weight: 5,
        priorities: [
            { range: [0, 384], priority: 3, lineCap: 'round' }, // only silver
            { range: [385, 2252], priority: 1, lineCap: 'butt' }, // silver and orange
            { range: [2253, 3310], priority: 1, lineCap: 'butt' }, // silver orange and blue
            { range: [3311, 3545], priority: 1, lineCap: 'round' }, // silver and blue
        ],
        directions: directions,
        invertGeometry: false,
        complementColor: 'black',
    }
};

export {
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    BLUE,
    SILVER,
    LINE_NAMES,
    LINE_PROPERTIES,
    LINE_MERGES,
};