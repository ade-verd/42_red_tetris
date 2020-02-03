'use strict';

const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');

const { getDb } = require('../../lib/mongodb');
const dateLib = require('../../lib/utils/date');

const { COLLECTION, INDEXES } = require('./definition');

function _validate(player) {
  const schema = Joi.object({
    name: Joi.string().required(),
    blocks_consumed: Joi.number().min(0).required(),
    created_at: Joi.date().default(dateLib.newDate()),
    updated_at: Joi.date().default(dateLib.newDate()),
  }).required();

  return Joi.attempt(player, schema);
}

/**
 * Return the players collection
 *
 * @returns {Object} object to manipulate players collection
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
  console.log('[players] collection and indexes created');
}

/**
 * Returns a cursor on lots for a given query.
 *
 * @param {object} query       - mongo query
 * @param {object} projections - optional projection of results fields
 *
 * @returns {Promise<Cursor>} The cursor to iterate on messages
 */
function find(query = {}, projection = {}) {
  return collection().find(query, { projection });
}

/**
 * Returns a player found with its id
 *
 * @param {ObjectId} playerId   - identifier of the queried player
 * @param {Object} projections - optional projection of result fields
 *
 * @returns {Object} The mongo document
 */
function findOneById(playerId, projection = {}) {
  return collection().findOne(
    {_id: ObjectId.createFromHexString(playerId) },
    { projection } 
  );
}

/**
 * Insert a new player into the database
 *
 * @param {Object} player - data about the inserted player
 *
 * @returns {Object} the inserted player
 */
async function insertOne(player) {
  const validatedRoom = _validate(player);
  const res = await collection().insert(validatedRoom);

  return res.ops[0];
}

/**
 * Update a player
 *
 * @param {ObjectId} playerId     - identifier of the updated player
 * @param {Object} updatedFields - fields that are updated
 *
 * @returns {Object/null} result of update if succeeded, null otherwise
 */
async function updateOne(playerId, updatedFields) {
  const result = await collection().updateOne(
    { _id: ObjectId.createFromHexString(playerId) },
    { $set: { ...updatedFields, updated_at: dateLib.newDate() } },
  );
  return result;
}

module.exports = {
  collection,
  createIndexes,
  find,
  findOneById,
  insertOne,
  updateOne,
};
