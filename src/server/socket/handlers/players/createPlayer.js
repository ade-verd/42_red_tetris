'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Player = require('../../../lib/players/classPlayer');

const schema = {
    name: Joi.string().required(),
};

const ON_EVENT = 'players:create';
const EMIT_EVENT = 'players:created';
const FUNCTION_NAME = '[createPlayer]';

const _createNewPlayer = async (socket, payload) => {
    try {
        const newPlayer = await new Player({ name: payload.name });
        socket.emit(EMIT_EVENT, await newPlayer.find());
    } catch (err) {
        socket.emit(EMIT_EVENT, { error: err.toString() });
        console.error(FUNCTION_NAME, err);
    }
};

export const createPlayer = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await _createNewPlayer(socket, payload);
    },
);
