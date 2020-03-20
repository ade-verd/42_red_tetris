'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Player = require('../../../lib/players/classPlayer');

const schema = {
    player_id: Joi.string().required(),
};

const ON_EVENT = 'players:socket:update';
const EMIT_EVENT = 'players:socket:updated';
const FUNCTION_NAME = '[updateSocketId]';

const _updatePlayer = async (socket, payload) => {
    try {
        const player = await new Player({ playerId: payload.player_id });
        const res = await player.update({ socket_id: socket.client.id });
        socket.emit(EMIT_EVENT, { payload, update: res });
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

export const updateSocketId = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await _updatePlayer(socket, payload);
    },
);
