'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const getPiecesLib = require('../../../lib/pieces/getPieces');

const schema = {
    room_id: Joi.string().required(),
    pieces_position: Joi.number().required(),
    number: Joi.number().default(1),
};

const emitNewPieces = async (socket, payload) => {
    const [roomId, piecePosition, piecesNumber] = [
        payload.room_id,
        payload.pieces_position,
        payload.number,
    ];
    try {
				const pieces = await getPiecesLib.getTetriminos(roomId, piecePosition, piecesNumber);
        socket.emit('tetriminos:get_random', pieces);
    } catch (err) {
        socket.emit('tetriminos:get_random', { error: err.toString() });
        console.error('[getTetriminos]', err);
    }
};

export const getRandomTetriminos = helpers.createEvent(
    'tetriminos:get_random',
    schema,
    async (socket, payload) => {
        await emitNewPieces(socket, payload);
    },
);
