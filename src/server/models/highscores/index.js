'use strict';

const Joi = require('@hapi/joi');

const { COLLECTION, INDEXES } = require('./definition');
const { getDb } = require('../../lib/mongodb');
const dateLib = require('../../lib/utils/date');

function _validate(room) {
  const schema = Joi.object({
    player_id: Joi.string().required(),
    player_name: Joi.string().required(),
    score: Joi.number().required(),
    created_at: Joi.date().default(dateLib.newDate()),
  }).required();

  return Joi.attempt(room, schema);
}

/**
 * Return the highscores collection
 *
 * @returns {Object} object to manipulate highscores collection
 */
function collection() {
  return getDb().collection(COLLECTION);
}

/**
 * Create collection indexes
 *
 * @returns {void}
 */
async function createIndexes() {
  await collection().createIndex(INDEXES.KEYS, INDEXES.OPTIONS);
  console.log('[highscores] collection and indexes created');
}

/**
 * Returns a cursor first N (limit Number) highscores
 *
 * @param {Number} limitNumber        limit scores to return
 *
 * @returns {Array} Highscores as sorted array 
 */
function findHighScores(limitNumber) {
  return collection().find(
    {},
    {
      limit: limitNumber,
      sort: [['score', -1]],
    }).toArray();
}

/**
 * Insert a new score into the database
 *
 * @param {Object} highscoreObject - data about the inserted score
 *
 * @returns {Object} the inserted score
 */
async function insertOne(highscoreObject) {
  const validatedHighscore = _validate(highscoreObject);
  const res = await collection().insert(validatedHighscore);

  return res.ops[0];
}

module.exports = {
  collection,
  createIndexes,
  findHighScores,
  insertOne,
};
