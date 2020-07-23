'use strict';

const helpers = require('../../eventHelpers');

const highscoresLib = require('../../../models/highscores');

const ON_EVENT = 'highscores:request';
const EMIT_EVENT = 'highscores:requested'
const FUNCTION_NAME = '[emitHighscores]'

const emitHighscores = async (socket, payload) => {
    try {
        const highscoresCursor = await highscoresLib.findHighScores(10);
        const highscores = highscoresCursor.map(highscore => ({ name: highscore.player_name, score: highscore.score }));
        socket.emit(EMIT_EVENT, { highscores });
        console.log('[socket event emited]', EMIT_EVENT, { highscores });
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

export const getHighscores = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    null,
    async (socket, payload) => {
        await emitHighscores(socket, payload);
    },
);
