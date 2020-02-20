'use strict';

const DATABASE = 'redtetris';
const COLLECTION = 'rooms';
const COLLECTION_OPTIONS = {};

const INDEXES = [
    {
        key: { room_name: 1 },
        background: true,
    },
    {
        key: { game_status: 'text' },
        background: true,
    },
];

module.exports = {
    DATABASE,
    COLLECTION,
    COLLECTION_OPTIONS,
    INDEXES,
};
