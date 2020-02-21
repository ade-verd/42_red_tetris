'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Room = require('../../../lib/rooms/classRoom');

const schema = {
    room_name: Joi.string().required(),
    admin_id: Joi.string().required(),
};

const ON_EVENT = 'rooms:create';
const EMIT_EVENT = 'rooms:created';
const FUNCTION_NAME = '[createRoom]';

const _createNewRoom = async (socket, payload) => {
    try {
        const newRoom = await new Room({
            roomName: payload.room_name,
            roomCreaterId: payload.admin_id,
        });
        socket.emit(EMIT_EVENT, { room_id: newRoom.id });
    } catch (err) {
        socket.emit(EMIT_EVENT, { error: err.toString() });
        console.error(FUNCTION_NAME, err);
    }
};

export const createRoom = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await _createNewRoom(socket, payload);
    },
);
