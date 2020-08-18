'use strict';

const DATABASE = 'redtetris';
const COLLECTION = 'highscores';
const COLLECTION_OPTIONS = {};

const INDEXES = [
    {
        key: { player_id: 1, score: 1 },
        background: true,
        unique: true,
    },
];

module.exports = {
    DATABASE,
    COLLECTION,
    COLLECTION_OPTIONS,
    INDEXES,
};
