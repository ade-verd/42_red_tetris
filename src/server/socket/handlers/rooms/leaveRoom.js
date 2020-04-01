'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Room = require('../../../lib/rooms/classRoom');
const leaveRoomSocket = require('../../lib/roomSocket/leaveRoomSocket');
const getActiveRooms = require('./getActiveRooms.js');

const schema = {
    room_id: Joi.string().required(),
    player_id: Joi.string().required(),
};

const ON_EVENT = 'rooms:leave';
const EMIT_EVENT = 'rooms:left';
const FUNCTION_NAME = '[leaveRoom]';

const _leaveExistingRoom = async (socket, payload) => {
    let res;

    try {
        const room = await new Room({
            roomId: payload.room_id,
        });
        res = await room.leave(payload.player_id);
        await leaveRoomSocket.leave(socket, room.id);
        socket.emit(EMIT_EVENT, { payload, update: res.result });
        await getActiveRooms.emitActiveRooms();
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

export const leaveRoom = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await _leaveExistingRoom(socket, payload);
    },
);
