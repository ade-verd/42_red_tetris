'use strict';

const { TETRIMINOS } = require('./tetriminos.js');

const GAME_STATUS = {
	WAITING: 'waiting',
	PLAYING: 'playing',
	OFFLINE: 'offline',
}

const PIECES_NUMBER_AT_ROOM_CREATION = 20;

module.exports = {
	GAME_STATUS,
	PIECES_NUMBER_AT_ROOM_CREATION,
	TETRIMINOS,
}