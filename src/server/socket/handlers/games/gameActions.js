'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Game = require('../../../lib/games/classGame');

const { GAME_ACTIONS } = require('../../../../constants');

const schema = {
    room_id: Joi.string().required(),
    action: Joi.string()
        .valid(...Object.keys(GAME_ACTIONS).map(action => GAME_ACTIONS[action]))
        .required(),
};

const ON_EVENT = 'games:action:run';
const EMIT_EVENT = 'games:action:ran';
const FUNCTION_NAME = '[gameAction]';

const _runActionGame = async (socket, payload) => {
    console.log('DONE11111');
    try {
        const game = new Game({ roomId: payload.room_id });
        const result = await game[payload.action]();
        const status = await game.status();
        socket.emit(EMIT_EVENT, { payload, result, status });
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

export const gameAction = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await _runActionGame(socket, payload);
    },
);
