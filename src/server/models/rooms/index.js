'use strict';

const Joi = require('@hapi/joi');
const { ObjectId} = require('mongodb');

const { DATABASE, COLLECTION } = require('./definition');
const { GAME_STATUS } = require('../../constants');
const { getDb } = require('../../lib/mongodb');
const dateLib = require('../../lib/utils/date');

function _validate(room) {
	const schema = Joi.object({
		room_name: Joi.string().required(),
		players_ids: [
			Joi.string().required(),
		].required(),
		game_status: Joi.string.valid(GAME_STATUS.map(status => status)).required(),
		block_list: Joi.array().require(),
		settings: Joi.object().required(),
		created_at: Joi.date().default([newDate(), 'creation date']),
		updated_at: Joi.date().default([newDate(), 'creation date']),
	}).required();

  	return Joi.attempt(room, schema);
}

/**
 * Return the rooms collection
 *
 * @returns {Object} object to manipulate rooms collection
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
	await collection().createIndex({ room_name: 1 }, { unique: true, background: true });
}

/**
 * Returns a cursor on lots for a given query.
 *
 * @param {object} query       - mongo query
 * @param {object} projections - optional projection of results fields
 *
 * @returns {Promise<Cursor>} The cursor to iterate on messages
 */
function find(query = {}, projections = {}) {
  return collection().find(query, projections);
}

/**
 * Returns a room found with its id
 *
 * @param {ObjectId} roomId   - identifier of the queried room
 * @param {Object} projections - optional projection of result fields
 *
 * @returns {Object} The mongo document
 */
function findOneById(roomId, projections = {}) {
  return collection().findOne({ _id: roomId }, projections);
}

/**
 * Insert a new room into the database
 *
 * @param {Object} room - data about the inserted room
 *
 * @returns {Object} the inserted room
 */
async function insertOne(room) {
  const validatedRoom = _validate(room);
  const res = await collection().insert(validatedRoom);

  return res.ops[0];
}

/**
 * Update a room
 *
 * @param {ObjectId} roomId     - identifier of the updated room
 * @param {Object} updatedFields - fields that are updated
 *
 * @returns {Object/null} result of update if succeeded, null otherwise
 */
async function updateOne(roomId, updatedFields) {
  const result = await collection().updateOne(
    { _id: roomId },
    { $set: updatedFields },
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
