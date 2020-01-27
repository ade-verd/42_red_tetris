'use strict';

const DATABASE = 'redtetris';
const COLLECTION = 'rooms';
const COLLECTION_OPTIONS = {};

const INDEXES = [
	 [{ room_name: 1 }, { unique: true, background: true }],
];

module.exports = {
	DATABASE,
	COLLECTION,
	COLLECTION_OPTIONS,
	INDEXES,
};