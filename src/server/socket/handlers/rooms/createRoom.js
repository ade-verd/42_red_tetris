'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Room = require('../../../lib/rooms/classRoom');

const schema = {
    room_name: Joi.string().required(),
    admin_id: Joi.string().required(),
};

const _createNewRoom = async (socket, payload) => {
    try {
        const newRoom = await new Room(payload.room_name, payload.admin_id);
        socket.emit('rooms:created', { room_id: newRoom.id });
    } catch (err) {
        socket.emit('rooms:created', { error: err.toString() });
        console.error('[createRoom]', err);
    }
};

export const createRoom = helpers.createEvent('rooms:create', schema, async (socket, payload) => {
    await _createNewRoom(socket, payload);
});
