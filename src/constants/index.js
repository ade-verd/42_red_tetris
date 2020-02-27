'use strict';

const { TETRIMINOS } = require('./tetriminos.js');

const GAME_STATUS = {
    WAITING: 'waiting',
    PLAYING: 'playing',
    OFFLINE: 'offline',
    PAUSE: 'pause',
};

const GAME_ACTIONS = {
    START: 'start',
    PAUSE: 'pause',
    RESUME: 'resume',
    STOP: 'stop',
};

const MAX_PLAYERS = 5;

const PIECES_NUMBER_AT_ROOM_CREATION = 20;

module.exports = {
    GAME_ACTIONS,
    GAME_STATUS,
    MAX_PLAYERS,
    PIECES_NUMBER_AT_ROOM_CREATION,
    TETRIMINOS,
};
