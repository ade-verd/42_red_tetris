'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Room = require('../../../lib/rooms/classRoom');
const changeRoomSocket = require('../../lib/roomSocket/changeRoomSocket');
const getActiveRooms = require('./getActiveRooms.js');

const schema = {
    room_id: Joi.string().required(),
    player_id: Joi.string().required(),
};

const ON_EVENT = 'rooms:join';
const EMIT_EVENT = 'rooms:joined';
const FUNCTION_NAME = '[joinRoom]';

const _joinExistingRoom = async (socket, payload) => {
    let res;

    try {
        const room = await new Room({
            roomId: payload.room_id,
        });
        res = await room.join(payload.player_id);
        await changeRoomSocket.change(socket, room.id);
        socket.emit(EMIT_EVENT, { payload, update: res });
        await getActiveRooms.emitActiveRooms();
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

const joinRoom = helpers.createEvent(ON_EVENT, EMIT_EVENT, schema, async (socket, payload) => {
    await _joinExistingRoom(socket, payload);
});

module.exports = { joinRoom };
