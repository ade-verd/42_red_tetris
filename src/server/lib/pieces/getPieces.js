'use strict';

const roomsModels = require('../../models/rooms');

const Piece = require('./classPiece');

async function getTetriminos(roomId, piecePosition, piecesNumber) {
	const availablePieces = await this._getAvailableTetriminos(roomId, piecePosition, piecesNumber);
	const piecesNumberToCreate = piecesNumber - availablePieces.length;
	if (piecesNumberToCreate) {
		await this.createNewRandomTetriminos(roomId, piecesNumberToCreate);
		return this._getAvailableTetriminos(roomId, piecePosition, piecesNumber);
	}
	return availablePieces;

}

async function _getAvailableTetriminos(roomId, piecePosition, piecesNumber) {
	const { blocks_list: blocksList } = await roomsModels.findOneById(
		roomId,
		{ _id: 0, blocks_list: 1 }
	);

	return blocksList.slice(piecePosition, piecePosition + piecesNumber);
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