const TETRIMINOS = {
    BLOCK_NAMES: 'IOJLSZT',
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
        color: '204,0,0',
        rotationsPossible: 2,
    },
    O: {
        shape: [
            ['O', 'O'],
            ['O', 'O'],
        ],
        color: '204,0,0',
        rotationsPossible: 1,
    },
    J: {
        shape: [
            [0, 'J', 0],
            [0, 'J', 0],
            ['J', 'J', 0],
        ],
        color: '204,0,0',
        rotationsPossible: 4,
    },
    L: {
        shape: [
            [0, 'L', 0],
            [0, 'L', 0],
            [0, 'L', 'L'],
        ],
        color: '204,0,0',
        rotationsPossible: 4,
    },
    S: {
        shape: [
            [0, 'S', 'S'],
            ['S', 'S', 0],
            [0, 0, 0],
        ],
        color: '204,0,0',
        rotationsPossible: 2,
    },
    Z: {
        shape: [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z'],
            [0, 0, 0],
        ],
        color: '204,0,0',
        rotationsPossible: 2,
    },
    T: {
        shape: [
            [0, 'T', 0],
            ['T', 'T', 'T'],
            [0, 0, 0],
        ],
        color: '204,0,0',
        rotationsPossible: 4,
    },
};

module.exports = { TETRIMINOS };
