'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const playerModels = require('../../../models/players');

const schema = {
    players_ids: Joi.array()
        .items(Joi.string().required())
        .required(),
};

const ON_EVENT = 'players:players:get';
const EMIT_EVENT = 'players:players:got';
const FUNCTION_NAME = '[getPlayers]';

const _getPlayers = async (socket, payload) => {
    try {
        const players = await playerModels.findAllByIds(payload.players_ids);
        const array = await players.toArray();
        socket.emit(EMIT_EVENT, { payload, players: array });
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

const getPlayer = helpers.createEvent(ON_EVENT, EMIT_EVENT, schema, async (socket, payload) => {
    await _getPlayers(socket, payload);
});

module.exports = {
    getPlayer,
};
