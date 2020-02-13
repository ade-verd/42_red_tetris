'use strict';


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

	const randomInt = randomLib.getRandomInt(0, blockNames.length - 1);
	const randomBlockName = blockNames[randomInt];
	const randomTetrimino = TETRIMINOS[randomBlockName];
	return _getRandomRotation(randomTetrimino)
}

module.exports = {
	getRandomTetrimino,
	__TESTS__: {
		_getRandomRotation
	}
}