'use strict';

const { ObjectId } = require('mongodb');

const playersModels = require('../../models/players');
const roomsModels = require('../../models/rooms');

async function getPlayersNames(roomId) {
    const { players_ids: playersIds } = await roomsModels.findOneById(roomId);

    const playersObjectIds = playersIds.map(id => new ObjectId(id));

    return playersModels.find({ _id: { $in: playersObjectIds } }, { name: 1 }).toArray();
}

module.exports = { getPlayersNames };
