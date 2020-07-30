'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const playersLib = require('../../../models/players');

const schema = {
    room_id: Joi.string().required(),
};

const ON_EVENT = 'game:reset';
const EMIT_EVENT = 'game:reseted';
const FUNCTION_NAME = 'emitGameReset';

const emitGameReset = async (socket, payload) => {
    const [roomId] = [payload.room_id];

    try {
        await playersLib.updateMany({ room_id: roomId }, { game_over: false });
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }

    socket.to(roomId).emit(EMIT_EVENT);
    console.log('[socket event emited][to:', roomId, ']', EMIT_EVENT);
};

export const gameReset = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await emitGameReset(socket, payload);
    },
);
