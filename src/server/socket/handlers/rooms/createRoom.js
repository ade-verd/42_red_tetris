'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Room = require('../../../lib/rooms/classRoom');
const getActiveRooms = require('./getActiveRooms.js');

const schema = {
    room_name: Joi.string().required(),
    admin_id: Joi.string().required(),
};

const ON_EVENT = 'rooms:create';
const EMIT_EVENT = 'rooms:created';
const FUNCTION_NAME = '[createRoom]';

export const createNewRoom = async (socket, payload) => {
    try {
        const newRoom = await new Room({
            roomName: payload.room_name,
            roomCreaterId: payload.admin_id,
        });
        socket.emit(EMIT_EVENT, { room_id: newRoom.id, room_name: payload.room_name });
        await getActiveRooms.emitActiveRooms(socket, {});
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

export const createRoom = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await createNewRoom(socket, payload);
    },
);
