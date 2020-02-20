'use strict';

const roomsLib = require('../../models/rooms');
const getPiecesLib = require('../pieces/getPieces');

const { GAME_STATUS, MAX_PLAYERS, PIECES_NUMBER_AT_ROOM_CREATION } = require('../../../constants');

class asyncRoom {
    constructor({ roomName, roomCreaterId, roomId = null }) {
        if (roomId) {
            this.id = roomId;
            return this;
        }
        return (async () => {
            const blocksList = await getPiecesLib.createNewRandomTetriminos(
                null,
                PIECES_NUMBER_AT_ROOM_CREATION,
            );
            const roomToInsert = {
                room_name: roomName,
                players_ids: [roomCreaterId],
                game_status: GAME_STATUS.WAITING,
                blocks_list: blocksList,
                settings: {},
            };

            const insertedRoom = await roomsLib.insertOne(roomToInsert);
            this.id = insertedRoom._id.toString();
            return this;
        })();
    }

    find = async projection => {
        return roomsLib.findOneById(this.id, projection);
    };

    update = async fieldsToUpdate => {
        return roomsLib.updateOne(this.id, fieldsToUpdate);
    };

    join = async playerId => {
        const { players_ids: playersIds } = await roomsLib.find({}, { _id: 0, players_ids: 1 });
        if (playersIds.length >= MAX_PLAYERS) {
            throw new Error(`a room can not accept more than ${MAX_PLAYERS} players`);
        }
        const result = await roomsLib.updateJoinRoom(this.id, playerId);
        if (result.modifiedCount === 0) {
            throw new Error('the room has not been updated');
        }
        return result;
    };

    leave = async playerId => {
        const result = await roomsLib.updateLeaveRoom(this.id, playerId);
        if (result.modifiedCount === 0) {
            throw new Error('the room has not been updated');
        }

        const { players_ids: playersIds } = await roomsLib.find({}, { _id: 0, players_ids: 1 });
        if (playersIds.length === 0) {
            await roomsLib.updateOne(this.id, { game_status: GAME_STATUS.OFFLINE });
        }
        return result;
    };
}

module.exports = asyncRoom;
