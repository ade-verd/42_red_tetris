'use strict';

const playersModels = require('../../models/players');
const roomsModels = require('../../models/rooms');

async function getPlayersNames(roomId) {
    const { players_ids: playersIds } = await roomsModels.findOneById(roomId);

    return playersModels.find({ _id: { $in: playersIds } }, { name: 1 }).toArray();
}

module.exports = { getPlayersNames };
