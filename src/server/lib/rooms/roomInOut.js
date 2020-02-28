'use strict';

const roomsLib = require('../../models/rooms');
const getPiecesLib = require('../pieces/getPieces');

const { GAME_STATUS, MAX_PLAYERS } = require('../../../constants');

export const joinOrCreate = async (roomName, playerId) => {
    const room = roomsLib.findOneByName(roomName);

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
        return roomsLib.insertOne(roomToInsert);
    }

    const setFields = {};
    const { _id: roomId, game_status: status } = room;
    if (status === GAME_STATUS.OFFLINE) {
        setFields.game_status = GAME_STATUS.WAITING;
    }
    const joinResult = await this.join(roomId, playerId, setFields);
    return joinResult.value;
};

export const join = async (roomId, playerId, otherFields) => {
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
    return result;
};

export const leave = async (roomId, playerId) => {
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
    return result;
};
