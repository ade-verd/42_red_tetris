'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const schema = {
    room_id: Joi.string().required(),
    malus: Joi.number().required(),
};

const ON_EVENT = 'malus:send';
const EMIT_EVENT = 'malus:sent';

const emitMalus = async (socket, payload) => {
    const [roomId, malus] = [payload.room_id, payload.malus];

    socket.to(roomId).emit(EMIT_EVENT, { malus });
    console.log('[socket event emited][to:', roomId, ']', EMIT_EVENT, { malus });
};

export const malus = helpers.createEvent(ON_EVENT, EMIT_EVENT, schema, async (socket, payload) => {
    await emitMalus(socket, payload);
});
