'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const getPiecesLib = require('../../../lib/pieces/getPieces');

const schema = {
    room_id: Joi.string().required(),
    pieces_position: Joi.number().required(),
    number: Joi.number().default(1),
};

const ON_EVENT = 'tetriminos:get_random';
const EMIT_EVENT = 'tetriminos:get_random';
const FUNCTION_NAME = '[getTetriminos]';

const emitNewPieces = async (socket, payload) => {
    const [roomId, piecePosition, piecesNumber] = [
        payload.room_id,
        payload.pieces_position,
        payload.number,
    ];
    try {
        const pieces = await getPiecesLib.getTetriminos(roomId, piecePosition, piecesNumber);
        socket.emit(EMIT_EVENT, pieces);
    } catch (err) {
        socket.emit(EMIT_EVENT, { error: err.toString() });
        console.error(FUNCTION_NAME, err);
    }
};

export const getRandomTetriminos = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await emitNewPieces(socket, payload);
    },
);
