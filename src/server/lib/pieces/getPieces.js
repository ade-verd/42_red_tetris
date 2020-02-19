'use strict';

const roomsModels = require('../../models/rooms');

const Piece = require('./classPiece');

async function getTetriminos(roomId, piecePosition, piecesNumber) {
    const { availablePieces, piecesNumberToCreate } = await this._getAvailableTetriminos(
        roomId,
        piecePosition,
        piecesNumber,
    );
    if (piecesNumberToCreate) {
        await this.createNewRandomTetriminos(roomId, piecesNumberToCreate);
        const { availablePieces: pieces } = await this._getAvailableTetriminos(
            roomId,
            piecePosition,
            piecesNumber,
        );
        return pieces;
    }
    return availablePieces;
}

async function _getAvailableTetriminos(roomId, piecePosition, piecesNumber) {
    const { blocks_list: blocksList } = await roomsModels.findOneById(roomId, {
        _id: 0,
        blocks_list: 1,
    });

    const availablePieces = blocksList.slice(piecePosition, piecePosition + piecesNumber);
    const piecesNumberToCreate = Math.max(0, piecePosition - blocksList.length + piecesNumber);
    return { availablePieces, piecesNumberToCreate };
}

async function createNewRandomTetriminos(roomId, numberToCreate) {
    if (numberToCreate <= 0) return null;

    let blocksToPush = [];
    for (let i = 0; i < numberToCreate; i += 1) {
        blocksToPush.push(new Piece().tetrimino());
    }

    if (roomId === null) {
        return blocksToPush;
    }

    const result = await roomsModels.updateRoomBlockList(roomId, blocksToPush);
    return { ...result, blocksList: blocksToPush };
}

module.exports = {
    getTetriminos,
    _getAvailableTetriminos,
    createNewRandomTetriminos,
};
