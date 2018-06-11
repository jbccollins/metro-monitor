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
            { // entire red line
                range: [0, 1975], 
                priority: () => 3, 
                lineCap: 'round'
            }
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
            { // entire orange line
                range: [0, 5975],
                priority: () => 3,
                lineCap: 'round'
            }
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
            { // only yellow
                range: [0, 55], 
                priority: () => 3, 
                lineCap: 'round'
            },
            { // blue > yellow
                range: [56, 778],
                priority: lines => {
                    if (lines.includes(BLUE)) {
                        return 1;
                    }
                    return 3;
                },
                lineCap: 'butt'
            },
            { // only yellow
                range: [779, 971],
                priority: () => 3,
                lineCap: 'round'
            },
            { // green > yellow
                range: [972, 1362],
                priority: lines => {
                    if (lines.includes(GREEN)) {
                        return 1;
                    }
                    return 3;
                },
                lineCap: 'round'
            },
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
            { // entire green line
                range: [0, 1716],
                priority: () => 3,
                lineCap:'round'
            }
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
            { // only blue as well as blue and yellow. blue > yellow.
                range: [0, 1325],
                priority: () => 3,
                lineCap: 'round'
            },
            { // orange > blue > silver
                range: [1326, 2382],
                priority: lines => {
                    if (lines.includes(ORANGE)) {
                        if (lines.includes(SILVER)) {
                            return 2;
                        }
                        return 1;
                    }
                    return 3;
                },
                lineCap: 'butt'
            },
            { // blue > silver
                range: [2383, 2617],
                priority: () => 3,
                lineCap: 'round'
            },
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
            { range: [0, 384], priority: () => 3, lineCap: 'round' }, // only silver
            { // silver and orange
                range: [385, 2252],
                priority: lines => {
                    if (lines.includes(ORANGE)) {
                        return 1;
                    }
                    return 3;
                },
                lineCap: 'round'
            },
            { // silver orange and blue
                range: [2253, 3310],
                priority: lines => {
                    if (lines.includes(ORANGE) || lines.includes(BLUE)) {
                        return 1;
                    }
                    return 3;
                },
                lineCap: 'butt'
            },
            { // silver and blue
                range: [3311, 3545],
                priority: lines => {
                    if (lines.includes(BLUE)) {
                        return 1;
                    }
                    return 3;
                },
                lineCap: 'round'
            },
        ],
        directions: directions,
        invertGeometry: false,
        complementColor: 'black',
    }
};

const LINE_DRAW_ORDER = [RED, ORANGE, BLUE, GREEN, YELLOW, SILVER];

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
    LINE_DRAW_ORDER,
};