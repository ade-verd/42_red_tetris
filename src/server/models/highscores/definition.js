'use strict';

const DATABASE = 'redtetris';
const COLLECTION = 'highscores';
const COLLECTION_OPTIONS = {};

const INDEXES = {
	 KEYS: { _id: 1 },
	 OPTIONS: {},
};

module.exports = {
	DATABASE,
	COLLECTION,
	COLLECTION_OPTIONS,
	INDEXES,
};