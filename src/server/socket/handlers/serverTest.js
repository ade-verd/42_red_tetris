'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../eventHelpers');

const schema = {
    type: Joi.string().required(),
};

const ON_EVENT = 'action';
const EMIT_EVENT = 'action';
const FUNCTION_NAME = '[serverTest]';

const emitPong = (socket, payload) => {
    if (payload.type === 'server/ping') {
        socket.emit(EMIT_EVENT, { type: 'pong' });
    }
};

export const receivePing = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        // Logic here
        emitPong(socket, payload);
    },
);
