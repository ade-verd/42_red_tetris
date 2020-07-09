'use strict';

const Player = require('../players/classPlayer');
const roomsLib = require('../../models/rooms');
const getPiecesLib = require('../pieces/getPieces');

const { GAME_STATUS, MAX_PLAYERS, PIECES_NUMBER_AT_ROOM_CREATION } = require('../../../constants');

async function joinOrCreate(roomName, playerId) {
    const room = await roomsLib.findOneByName(roomName);

    if (room === null) {
        const blocksList = await getPiecesLib.createNewRandomTetriminos(
            null,
            PIECES_NUMBER_AT_ROOM_CREATION,
        );
        const roomToInsert = {
            room_name: roomName,
            players_ids: [playerId],
            game_status: GAME_STATUS.WAITING,
            blocks_list: blocksList,
            settings: {},
        };
        const result = await roomsLib.insertOne(roomToInsert);
        await updatePlayerRoom(result._id.toString(), playerId);
        return result;
    }

    const setFields = {};
    const { _id: roomId, game_status: status } = room;
    if (status === GAME_STATUS.OFFLINE) {
        setFields.game_status = GAME_STATUS.WAITING;
    }
    const joinResult = await this.join(roomId.toString(), playerId, setFields);
    return joinResult.value;
}

async function join(roomId, playerId, otherFields) {
    const { players_ids: playersIds } = await roomsLib.findOneById(roomId, {
        _id: 0,
        players_ids: 1,
    });
    if (playersIds.length >= MAX_PLAYERS) {
        throw new Error(`a room can not accept more than ${MAX_PLAYERS} players`);
    }
    const result = await roomsLib.updateJoinRoom(roomId, playerId, otherFields);
    if (result.value === null) {
        throw new Error('the room has not been updated');
    }

    await updatePlayerRoom(roomId, playerId);
    return result;
}

async function leave(roomId, playerId) {
    const result = await roomsLib.updateLeaveRoom(roomId, playerId);
    if (result.value === null) {
        throw new Error('the room has not been updated');
    }

    const { players_ids: playersIds } = await roomsLib.findOneById(roomId, {
        _id: 0,
        players_ids: 1,
    });
    if (playersIds.length === 0) {
        await roomsLib.updateOne(roomId, { game_status: GAME_STATUS.OFFLINE });
    }
    await updatePlayerRoom(null, playerId);

    return result;
}

async function setOffline(roomId) {
    return roomsLib.updateOne(roomId, { players_ids: [], game_status: GAME_STATUS.OFFLINE });
}

async function updatePlayerRoom(roomId, playerId) {
    const player = await new Player({ playerId }).update({ room_id: roomId });
    if (player.modifiedCount === 0) {
        throw new Error("the player's room has not been updated");
    }
}

module.exports = {
    joinOrCreate,
    join,
    leave,
    setOffline,
};
