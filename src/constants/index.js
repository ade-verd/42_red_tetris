'use strict';

const { TETRIMINOS } = require('./tetriminos.js');

const GAME_STATUS = {
    WAITING: 'waiting',
    PLAYING: 'playing',
    OFFLINE: 'offline',
};

module.exports = {
    GAME_STATUS,
    TETRIMINOS,
};
