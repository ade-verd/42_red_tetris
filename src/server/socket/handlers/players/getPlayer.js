'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Player = require('../../../lib/players/classPlayer');

const schema = {
    player_id: Joi.string().required(),
};

const ON_EVENT = 'players:player:get';
const EMIT_EVENT = 'players:player:got';
const FUNCTION_NAME = '[getPlayer]';

const _getPlayer = async (socket, payload) => {
    try {
        const player = await new Player({
            playerId: payload.player_id,
        }).find({});
        socket.emit(EMIT_EVENT, { payload, player });
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

const getPlayer = helpers.createEvent(ON_EVENT, EMIT_EVENT, schema, async (socket, payload) => {
    await _getPlayer(socket, payload);
});

module.exports = {
    getPlayer,
};
