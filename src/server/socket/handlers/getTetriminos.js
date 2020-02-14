'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../eventHelpers');

const getPiecesLib = require('../../lib/pieces/getPieces');

const schema = {
	room_id: Joi.string().required(),
	number: Joi.number().default(1),
	pieces_position: Joi.number().required(),
};

const emitNewPieces = async (socket, payload) => {
	const [roomId, numberToCreate] = [payload.room_id, payload.number];
	try {
		const creationResult = await getPiecesLib.createNewRandomTetriminos(roomId, numberToCreate);
		socket.emit('tetriminos:get_random', creationResult.blockList);
	} catch (err) {
		console.error('[getTetriminos]', err);
	}
};

export const getRandomTetriminos = helpers.createEvent(
	'tetriminos:get_random',
	schema,
	async (socket, payload) => {
		await emitNewPieces(socket, payload);
	}
);