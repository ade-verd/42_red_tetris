'use strict';

const Joi = require('@hapi/joi');

const { DATABASE, COLLECTION } = require('./definition');
const { GAME_STATUS } = require('../../constants');
const { newDate } = require('../../lib/utils/date');

function validate(room) {
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

	const validation = schema.validate(room);
	if (validation.error) {
		throw new Error(`Validation error: ${validation.error}`);
	}
	return validation.value;
}

/**
 * Returns the model collection
 * @param {object} mongodb MongoDb connections
 * @returns {object} Collection
 */
function collection(mongodb) {
	return mongodb.db(DATABASE).collection(COLLECTION);
}

/**
 * Get a room into the database by its id
 * @param {object} mongodb MongoDb connections
 * @param {object} roomId The room id
 *  @returns {Promise<object | null>} Found room
 */
function get(mongodb, roomId) {
	return collection(mongodb).findOne({
		_id: ObjectId.createFromHexString(roomId)
	});
}

/**
 * Insert a room into the database
 * @param {object} mongodb MongoDb connections
 * @param {object} room The room
 *  @returns {Promise<object>} Inserted room
 */
async function insert(mongodb, room) {
	const validatedRoom = validate(room);
	const res = await collection(mongodb).insertOne(validatedRoom, {
		returnOriginal: false
	});

	return res.ops[0];
}

/**
 * Updates a room into the database
 * @param {object} mongodb MongoDb connections
 * @param {object} room The room
 *  @returns {Promise<object>} Inserted room
 */
function update(mongodb, room) {
	return collection(mongodb).findOneAndUpdate({
		_id: room._id
	}, {
		$set: room
	}, {
		returnOriginal: false
	});
}

module.exports = {
	collection,
	get,
	insert,
	update
};