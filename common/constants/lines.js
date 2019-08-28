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
        commonDestinationStationCodes: ['A15', 'A11', 'B11', 'B08'],
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
        commonDestinationStationCodes: ['K08', 'D13'],
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
                // Fort Totten would be 1363
                range: [972, 1873],
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
        commonDestinationStationCodes: ['E10', 'C15'],
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
        commonDestinationStationCodes: ['F11', 'E10'],
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
        commonDestinationStationCodes: ['J03', 'G05'],
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
        commonDestinationStationCodes: ['N06', 'G05'],
    }
};

const LINE_DRAW_ORDER = [RED, ORANGE, BLUE, GREEN, YELLOW, SILVER];

const DUPLICATE_STATION_CODES = [
    'E06', // Green/Yellow Ft Totten
    'F01', // Green/Yellow Gallery Place
    'C01', // Blue/Orange/Silver Metro Center
    'D03', // Blue/Orange/Silver L'Enfant Plaza
];

const STATIONS_WITH_PERMANENT_LABELS = [
    "N06", // left silver
    "K08", // left orange
    "B11",
    "A15",
    "J03",
    "G05",
    "D13",
    "C15",
    "E10",
    "F11",
];

const RIGHT_SIDE = {
    origin: "bottom right",
    translate: "15px, -5px",
    rotate: "0deg"  
};

const RIGHT_SIDE_TRANSFER = {
    ...RIGHT_SIDE,
    translate: "20px, -5px",
}

const LEFT_SIDE = {
    origin: "bottom right",
    translate: "calc(-100% - 10px), -5px",
    rotate: "0deg"
}

const RIGHT_45 = {
    origin: "top left",
    translate: "15px, -10px",
    rotate: "-30deg"
};

const LEFT_45 = {
    origin: "top right",
    translate: "calc(-100% - 10px)",
    rotate: "-30deg"
}

const STATION_LABEL_STYLES = {
    "B11": RIGHT_SIDE,
    "B10": RIGHT_SIDE,
    "B09": RIGHT_SIDE,
    "B08": RIGHT_SIDE,
    "B07": RIGHT_SIDE,
    "B06": RIGHT_45,
    "B05": RIGHT_SIDE,
    "B04": RIGHT_SIDE,
    "B35": RIGHT_SIDE,
    "B03": RIGHT_SIDE,
    "B02": RIGHT_SIDE,
    "D13": RIGHT_SIDE,
    "G05": RIGHT_SIDE,
    "C15": RIGHT_SIDE,
    "F04": RIGHT_45,
    "A01": RIGHT_45,
    "F03": RIGHT_45,
    "B01": RIGHT_45,
    "C02": RIGHT_45,
    "F02": RIGHT_SIDE,
    "E03": RIGHT_45,
    "D06": RIGHT_45,
    "K08": LEFT_SIDE,
    "N06": LEFT_SIDE,
    "J03": LEFT_SIDE,
    "D09": RIGHT_SIDE,
    "D10": RIGHT_SIDE,
    "D11": RIGHT_SIDE,
    "D12": RIGHT_SIDE,
    "K06": LEFT_SIDE,
    "K01": LEFT_SIDE,
    "K02": LEFT_SIDE,
    // Rosslyn
    "C05": RIGHT_SIDE_TRANSFER,
    "K03": RIGHT_SIDE,
    "N01": LEFT_SIDE,
    "C08": RIGHT_SIDE,
    "C09": RIGHT_SIDE,
    "C12": RIGHT_SIDE,
    "C13": RIGHT_SIDE_TRANSFER,
    "C14": RIGHT_SIDE,
};

const TRANSFER_STATIONS = [
    "A01",
    "B01",
    "F03",
    "C05",
    "K05",
    "C07",
    "D08",
    "C13",
    "B06",
];

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
    DUPLICATE_STATION_CODES,
    STATIONS_WITH_PERMANENT_LABELS,
    STATION_LABEL_STYLES,
    TRANSFER_STATIONS,
    LEFT_SIDE,
    LEFT_45,
};