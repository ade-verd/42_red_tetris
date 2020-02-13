'use strict';

class Piece {
	constructor() {
		this._piece = randomPiecesLib.getRandomTetrimino();
	}

	tetrimino = () => {
		return this._piece;
	}

	shape = () => {
		return this._piece.shape;
	}

	color = () => {
		return this._piece.color;
	}

	rotationsPossible = () => {
		return this._piece.rotationsPossible;
	}
}

module.exports = Piece;

// placed here to avoid circular dependency
const randomPiecesLib = require('./randomPieces.js')
