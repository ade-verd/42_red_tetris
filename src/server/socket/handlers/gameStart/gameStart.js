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

const schema = {
    room_id: Joi.string().required(),
    pieces: getPiecesJoi(),
    index: Joi.number().required(),
};

const ON_EVENT = 'game:start';
const EMIT_EVENT = 'game:started';

const emitGameStart = async (socket, payload) => {
    const [roomId, pieces, index] = [payload.room_id, payload.pieces, payload.index];

    socket.broadcast.to(roomId).emit(EMIT_EVENT, { pieces, index });
    console.log('[socket event emited][to:', roomId, ']', EMIT_EVENT, {
        pieces,
        index,
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
