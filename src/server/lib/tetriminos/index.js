'use strict';

const roomsModels = require('../../models/rooms');

const randomLib = require('../utils/random.js');
const matrixLib = require('../utils/matrix.js');

const { TETRIMINOS } = require('../../../constants');

function _getRandomRotation(initialTetrimino) {
    const tetrimino = { ...initialTetrimino };

    const rotationsPossible = tetrimino.rotationsPossible;

    if (rotationsPossible === 1) return tetrimino;

    const randomRotationsNumber = randomLib.getRandomInt(1, rotationsPossible);
    for (let i = 1; i < randomRotationsNumber; i += 1) {
        tetrimino.shape = matrixLib.rotateSquareMatrix(tetrimino.shape);
    }
    return tetrimino;
}

function getRandomTetrimino() {
    const blockNames = TETRIMINOS.BLOCK_NAMES;

    const randomBlockName = blockNames[randomLib.getRandomInt(0, blockNames.length - 1)];
		const randomTetrimino = TETRIMINOS[randomBlockName];
		console.log('test', randomTetrimino)
    return _getRandomRotation(randomTetrimino);
}

async function createNewRandomTetriminos(roomId, numberToCreate) {
    let blocksToPush = [];
    for (let i = 0; i < numberToCreate; i += 1) {
        blocksToPush.push(this.getRandomTetrimino());
    }

    const result = await roomsModels.updateRoomBlockList(roomId, blocksToPush);
    return { ...result, blockList: blocksToPush };
}

module.exports = {
    getRandomTetrimino,
    createNewRandomTetriminos,
    __TESTS__: {
        _getRandomRotation,
    },
};
