'use strict';

const roomsModels = require('../../models/rooms');

const Piece = require('./classPiece');

async function createNewRandomTetriminos(roomId, numberToCreate) {
	let blocksToPush = [];
	for (let i = 0; i < numberToCreate; i += 1) {
		blocksToPush.push(new Piece().tetrimino());
	}

	const result = await roomsModels.updateRoomBlockList(roomId, blocksToPush);
	return { ...result, blockList: blocksToPush };
}

module.exports = {
	createNewRandomTetriminos,
}