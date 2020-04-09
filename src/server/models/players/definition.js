'use strict';

const DATABASE = 'redtetris';
const COLLECTION = 'players';
const COLLECTION_OPTIONS = {};

const INDEXES = [
    { key: { socket_id: 1 }, background: true },
    { key: { room_id: 1 }, background: true },
];

module.exports = {
    DATABASE,
    COLLECTION,
    COLLECTION_OPTIONS,
    INDEXES,
};
