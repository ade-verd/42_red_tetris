'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const highscoresLib = require('../../../models/highscores');

const schema = {
    player_id: Joi.string().required(),
    player_name: Joi.string().required(),
    score: Joi.number().required(),
};

const ON_EVENT = 'score:send';
const EMIT_EVENT = 'score:sent';
const FUNCTION_NAME = '[insertScore]';

const insertScore = async (socket, payload) => {
    const [playerId, playerName, score] = [payload.player_id, payload.player_name, payload.score];
    try {
        await highscoresLib.insertOne({ player_id: playerId, player_name: playerName, score });
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

export const updateHighscores = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await insertScore(socket, payload);
    },
);
