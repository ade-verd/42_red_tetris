'use strict';

const { TETRIMINOS } = require('./tetriminos.js');

const GAME_STATUS = {
    WAITING: 'waiting',
    PLAYING: 'playing',
    OFFLINE: 'offline',
    PAUSE: 'pause',
};

const PIECES_NUMBER_AT_ROOM_CREATION = 20;

const MAX_PLAYERS = 5;

module.exports = {
    GAME_STATUS,
    MAX_PLAYERS,
    PIECES_NUMBER_AT_ROOM_CREATION,
    TETRIMINOS,
};
