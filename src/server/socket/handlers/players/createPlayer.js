'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Player = require('../../../lib/players/classPlayer');

const schema = {
    name: Joi.string().required(),
};

const _createNewPlayer = async (socket, payload) => {
    try {
        const newPlayer = await new Player({ name: payload.name });
        socket.emit('players:created', await newPlayer.find());
    } catch (err) {
        socket.emit('players:created', { error: err.toString() });
        console.error('[createPlayer]', err);
    }
};

export const createPlayer = helpers.createEvent(
    'players:create',
    schema,
    async (socket, payload) => {
        await _createNewPlayer(socket, payload);
    },
);
