'use strict';

const roomsLib = require('../../models/rooms');

const { GAME_STATUS, MAX_PLAYERS } = require('../../../constants');

export const join = async (roomId, playerId) => {
    const { players_ids: playersIds } = await roomsLib.findOneById(roomId, {
        _id: 0,
        players_ids: 1,
    });
    if (playersIds.length >= MAX_PLAYERS) {
        throw new Error(`a room can not accept more than ${MAX_PLAYERS} players`);
    }
    const result = await roomsLib.updateJoinRoom(roomId, playerId);
    if (result.modifiedCount === 0) {
        throw new Error('the room has not been updated');
    }
    return result;
};

export const leave = async (roomId, playerId) => {
    const result = await roomsLib.updateLeaveRoom(roomId, playerId);
    if (result.modifiedCount === 0) {
        throw new Error('the room has not been updated');
    }

    const { players_ids: playersIds } = await roomsLib.findOneById(roomId, {
        _id: 0,
        players_ids: 1,
    });
    if (playersIds.length === 0) {
        await roomsLib.updateOne(roomId, { game_status: GAME_STATUS.OFFLINE });
    }
    return result;
};
