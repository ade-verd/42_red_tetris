'use strict';

const randomPiecesLib = require('./randomPiece.js');

class Piece {
    constructor() {
        this._piece = randomPiecesLib.getRandomTetrimino();
    }

    tetrimino = () => {
        return this._piece;
    };

    shape = () => {
        return this._piece.shape;
    };

    color = () => {
        return this._piece.color;
    };

    rotationsPossible = () => {
        return this._piece.rotationsPossible;
    };
}

module.exports = Piece;
