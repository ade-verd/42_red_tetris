'use strict';

const assert = require('assert');
const { MongoClient } = require('mongodb');

const config = require('../config');

let client;
let db;

/**
 * Connect the database
 *
 * @returns {void}
 */
async function connect() {
    client = await MongoClient.connect(config.db.url, config.db.options);
    db = client.db(config.db.name);
    console.log({ db: config.db.name }, '> Database connected');
}

/**
 * Disconnect the database
 *
 * @returns {void}
 */
async function disconnect() {
    if (isConnected()) {
        await client.close();
        console.log({ db: config.db.name }, '> Mongodb disconnected');
    }
}

/**
 * Get database connection
 *
 * @returns {Object} database connection
 */
function getDb() {
    return db;
}

/**
 * Check if the client is connected
 *
 * @returns {boolean} True if connected
 */
function isConnected() {
    return !!db && !!db.topology && db.topology.isConnected();
}

module.exports = {
    connect,
    disconnect,
    getDb,
    isConnected,
};
