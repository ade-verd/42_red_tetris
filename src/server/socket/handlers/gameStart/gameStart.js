'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const getPiecesJoi = () => {
    const shapeRow = Joi.array().items(Joi.alternatives(Joi.string(), Joi.number()).required());
    const piece = Joi.object().keys({
        shape: Joi.array()
            .items(shapeRow)
            .required(),
        color: Joi.string().required(),
        rotationsPossible: Joi.number().required(),
    });
    const pieces = Joi.array().items(piece);

    return pieces;
};

const getNextTetrominoJoi = () => {
    const shapeRow = Joi.array().items(Joi.alternatives(Joi.string(), Joi.number()).required());

    return Joi.array().items(shapeRow).required();
};

const schema = {
    room_id: Joi.string().required(),
    pieces: getPiecesJoi(),
    index: Joi.number().required(),
    nextTetromino: getNextTetrominoJoi(),
};

const ON_EVENT = 'game:start';
const EMIT_EVENT = 'game:started';

const emitGameStart = async (socket, payload) => {
    const [roomId, pieces, index, nextTetromino] = [payload.room_id, payload.pieces, payload.index, payload.nextTetromino];

    socket.to(roomId).emit(EMIT_EVENT, { pieces, index, nextTetromino });
    console.log('[socket event emited][to:', roomId, ']', EMIT_EVENT, {
        pieces,
        index,
        nextTetromino,
    });
};

export const gameStart = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await emitGameStart(socket, payload);
    },
);
