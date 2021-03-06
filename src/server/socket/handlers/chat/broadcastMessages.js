'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const ioInstance = require('../../ioInstance');

const schema = {
    fromPlayerId: Joi.string().required(),
    fromPlayerName: Joi.string().required(),
    toRoomId: Joi.string().required(),
    message: Joi.string().required(),
    date: Joi.number().required(),
};

const ON_EVENT = 'chat:message:send';
const EMIT_EVENT = 'chat:message:broadcasted';
const FUNCTION_NAME = '[broadcastMessages]';

const LOBBY = 'lobby';

const _broadcast = async (socket, payload) => {
    try {
        const io = ioInstance.get();

        if (payload.toRoomId === LOBBY) {
            io.emit(EMIT_EVENT, payload);
        } else {
            io.in(payload.toRoomId).emit(EMIT_EVENT, payload);
        }
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

const broadcastMessages = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await _broadcast(socket, payload);
    },
);

module.exports = {
    broadcastMessages,
    ON_EVENT,
    EMIT_EVENT,
};
