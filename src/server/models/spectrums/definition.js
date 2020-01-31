'use strict';

const DATABASE = 'redtetris';
const COLLECTION = 'spectrums';
const COLLECTION_OPTIONS = {};

const INDEXES = [
	{
		key: { room_id: 1 },
		background: true,
	},
	{
		key: { room_id: 1, player_id: 1 },
		unique: true,
		background: true,
	}
];

module.exports = {
	DATABASE,
	COLLECTION,
	COLLECTION_OPTIONS,
	INDEXES,
};