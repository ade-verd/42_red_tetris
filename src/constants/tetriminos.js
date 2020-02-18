const TETRIMINOS = {
    BLOCK_NAMES: 'IOJLSZ',
    0: {
        shape: [[0]],
        color: '0, 0, 0',
    },
    I: {
        shape: [
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
        ],
        color: '29, 174, 236',
        rotationsPossible: 2,
    },
    O: {
        shape: [
            ['O', 'O'],
            ['O', 'O'],
        ],
        color: '255, 239, 53',
        rotationsPossible: 1,
    },
    J: {
        shape: [
            [0, 'J', 0],
            [0, 'J', 0],
            ['J', 'J', 0],
        ],
        color: '34, 118, 185',
        rotationsPossible: 4,
    },
    L: {
        shape: [
            [0, 'L', 0],
            [0, 'L', 0],
            [0, 'L', 'L'],
        ],
        color: '244, 146, 49',
        rotationsPossible: 4,
    },
    S: {
        shape: [
            [0, 'S', 'S'],
            ['S', 'S', 0],
            [0, 0, 0],
        ],
        color: '141, 196, 73',
        rotationsPossible: 2,
    },
    Z: {
        shape: [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z'],
            [0, 0, 0],
        ],
        color: '234, 32, 45',
        rotationsPossible: 2,
    },
    T: {
        shape: [
            [0, 'T', 0],
            ['T', 'T', 'T'],
            [0, 0, 0],
        ],
        color: '101, 49, 142',
        rotationsPossible: 4,
    },
};

module.exports = { TETRIMINOS };
