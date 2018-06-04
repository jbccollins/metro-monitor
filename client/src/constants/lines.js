const RED = 'red';
const ORANGE = 'orange';
const YELLOW = 'yellow';
const GREEN = 'green';
const BLUE = 'blue';
const SILVER = 'silver';
const ORANGE_RUSH = 'orange - rush +';
const LINE_NAMES = [
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    BLUE,
    SILVER,
    ORANGE_RUSH
];

const LINE_PROPERTIES = {
    [RED]: {
        color: 'red',
        code: 'RD',
        trackLineID: 'Red',
    },
    [ORANGE]: {
        color: 'orange',
        code: 'OR',
        trackLineID: 'Orange',
    },
    [YELLOW]: {
        color: 'yellow',
        code: 'YL',
        trackLineID: 'Yellow',
    },
    [GREEN]: {
        color: 'green',
        code: 'GR',
        trackLineID: 'Green',
    },
    [BLUE]: {
        color: 'blue',
        code: 'BL',
        trackLineID: 'Blue',
    },
    [SILVER]: {
        color: 'silver',
        code: 'SL',
        trackLineID: 'Silver',
    },
    [ORANGE_RUSH]: {
        color: 'purple',
        code: 'OR',
        trackLineID: 'IDK MAN',
    }
};

export {
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    BLUE,
    SILVER,
    ORANGE_RUSH,
    LINE_NAMES,
    LINE_PROPERTIES,
};