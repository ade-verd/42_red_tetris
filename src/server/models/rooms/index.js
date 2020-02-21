'use strict';

const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');

const { COLLECTION, INDEXES } = require('./definition');
const { GAME_STATUS, MAX_PLAYERS } = require('../../../constants');
const { getDb } = require('../../lib/mongodb');
const dateLib = require('../../lib/utils/date');

function validate(room) {
    const schema = Joi.object({
        room_name: Joi.string().required(),
        players_ids: Joi.array()
            .items(Joi.string().required())
            .required(),
        game_status: Joi.string()
            .valid(...Object.keys(GAME_STATUS).map(status => GAME_STATUS[status]))
            .required(),
        blocks_list: Joi.array().required(),
        settings: Joi.object().required(),
        created_at: Joi.date().default(dateLib.newDate()),
        updated_at: Joi.date().default(dateLib.newDate()),
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
    await collection().createIndexes(INDEXES);
    console.log('[rooms] collection and indexes created');
}

/**
 * Returns a cursor on lots for a given query.
 *
 * @param {object} query       - mongo query
 * @param {object} projections - optional projection of results fields
 *
 * @returns {Promise<Cursor>} The cursor to iterate
 */
function find(query = {}, projection = {}) {
    return collection().find(query, { projection });
}

/**
 * Returns a cursor of rooms for a specific game status.
 *
 * @param {string} gameStatusRegex       regex
 * @param {object} projections - optional projection of results fields
 *
 * @returns {Promise<Cursor>} The cursor to iterate
 */
function findRoomsByGameStatus(gameStatusRegex, projection = {}) {
    const query = { game_status: { $regex: gameStatusRegex } };
    return collection().find(query, { projection });
}

/**
 * Returns a room found with its id
 *
 * @param {String} roomId   - identifier of the queried room
 * @param {Object} projections - optional projection of result fields
 *
 * @returns {Object} The mongo document
 */
function findOneById(roomId, projection = {}) {
    return collection().findOne({ _id: ObjectId.createFromHexString(roomId) }, { projection });
}

/**
 * Insert a new room into the database
 *
 * @param {Object} room - data about the inserted room
 *
 * @returns {Object} the inserted room
 */
async function insertOne(room) {
    const validatedRoom = validate(room);
    const res = await collection().insert(validatedRoom);

    return res.ops[0];
}

/**
 * Update a room
 *
 * @param {String} roomId     - identifier of the updated room
 * @param {Object} updatedFields - fields that are updated
 *
 * @returns {Object/null} result of update if succeeded, null otherwise
 */
async function updateOne(roomId, updatedFields) {
    return collection().updateOne(
        { _id: ObjectId.createFromHexString(roomId) },
        { $set: { ...updatedFields, updated_at: dateLib.newDate() } },
    );
}

/**
 * Push block in blocks_list of a specific room
 *
 * @param {String} roomId     - identifier of the updated room
 * @param {Array} blocksToPush  - Array to push
 *
 * @returns {Object/null} result of update if succeeded, null otherwise
 */
async function updateRoomBlockList(roomId, blocksToPush) {
    return collection().updateOne(
        { _id: ObjectId.createFromHexString(roomId) },
        {
            $push: { blocks_list: { $each: blocksToPush } },
            $set: { updated_at: dateLib.newDate() },
        },
    );
}

/**
 * Join room while updating array players_ids
 *
 * @param {String} roomId     room identifier
 * @param {String} playerId     player identifier
 *
 * @returns {Object/null} result of update if succeeded, null otherwise
 */
async function updateJoinRoom(roomId, playerId) {
    return collection().updateOne(
        {
            _id: ObjectId.createFromHexString(roomId),
            players_ids: { $nin: [playerId] },
            $where: `this.players_ids.length < ${MAX_PLAYERS}`,
        },
        {
            $addToSet: { players_ids: playerId },
            $set: { updated_at: dateLib.newDate() },
        },
    );
}

/**
 * Leave room while updating array players_ids
 *
 * @param {String} roomId     room identifier
 * @param {String} playerId     player identifier
 *
 * @returns {Object/null} result of update if succeeded, null otherwise
 */
async function updateLeaveRoom(roomId, playerId) {
    return collection().updateOne(
        {
            _id: ObjectId.createFromHexString(roomId),
            players_ids: { $in: [playerId] },
        },
        {
            $pull: { players_ids: playerId },
            $set: { updated_at: dateLib.newDate() },
        },
    );
}

module.exports = {
    validate,
    collection,
    createIndexes,
    find,
    findRoomsByGameStatus,
    findOneById,
    insertOne,
    updateOne,
    updateRoomBlockList,
    updateJoinRoom,
    updateLeaveRoom,
};
