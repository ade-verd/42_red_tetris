'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Room = require('../../../lib/rooms/classRoom');

const schema = {
    room_id: Joi.string().required(),
};

const ON_EVENT = 'rooms:players:get';
const EMIT_EVENT = 'rooms:players:got';
const FUNCTION_NAME = '[getPlayers]';

const _getRoomPlayers = async (socket, payload) => {
    try {
        const room = await new Room({
            roomId: payload.room_id,
        });
        const players = await room.getPlayersName();
        socket.emit(EMIT_EVENT, { payload, players });
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

export const getPlayers = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await _getRoomPlayers(socket, payload);
    },
);
