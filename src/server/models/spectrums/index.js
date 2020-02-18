'use strict';

const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');

const { COLLECTION, INDEXES } = require('./definition');
const { getDb } = require('../../lib/mongodb');
const dateLib = require('../../lib/utils/date');

function _validate(spectrum) {
    const schema = Joi.object({
        room_id: Joi.string().required(),
        player_id: Joi.string().required(),
        spectrum: Joi.array()
            .items(
                Joi.number()
                    .min(0)
                    .required(),
            )
            .required(),
        created_at: Joi.date().default(dateLib.newDate()),
        updated_at: Joi.date().default(dateLib.newDate()),
    }).required();

    return Joi.attempt(spectrum, schema);
}

/**
 * Return the spectrums collection
 *
 * @returns {Object} object to manipulate spectrums collection
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
    console.log('[spectrums] collection and indexes created');
}

/**
 * Returns a cursor on lots for a given query.
 *
 * @param {object} query       - mongo query
 * @param {object} projections - optional projection of results fields
 *
 * @returns {Promise<Cursor>} The cursor to iterate on spectrums
 */
function find(query = {}, projection = {}) {
    return collection().find(query, { projection });
}

/**
 * Returns spectrums found with its room id
 *
 * @param {ObjectId} roomId   - identifier of the queried room id
 * @param {Object} projections - optional projection of result fields
 *
 * @returns {Promise<Cursor>} The cursor to iterate on spectrums
 */
function findSpectrumsByRoomId(roomId, projection = {}) {
    return collection().find({ room_id: roomId }, { projection });
}

/**
 * Insert a new spectrum into the database
 *
 * @param {Object} playerSpectrum - data about the inserted spectrum
 *
 * @returns {Object} the inserted spectrum
 */
async function insertOne(playerSpectrum) {
    const validatedPlayerSpectrum = _validate(playerSpectrum);
    const res = await collection().insert(validatedPlayerSpectrum);

    return res.ops[0];
}

/**
 * Update a spectrum
 *
 * @param {String} roomId          room identifier
 * @param {String} playerId        player identifier
 * @param {Array<number>} spectrum Spectrum to update
 * @returns {Object/null} result of update if succeeded, null otherwise
 */
async function updateOneSpectrum(roomId, playerId, spectrum) {
    const result = await collection().updateOne(
        {
            room_id: roomId,
            player_id: playerId,
        },
        { $set: { spectrum, updated_at: dateLib.newDate() } },
    );
    return result;
}

module.exports = {
    collection,
    createIndexes,
    find,
    findSpectrumsByRoomId,
    insertOne,
    updateOneSpectrum,
};
