'use strict';

const roomsLib = require('../../models/rooms');
const getPiecesLib = require('../pieces/getPieces');

const { GAME_STATUS, PIECES_NUMBER_AT_ROOM_CREATION } = require('../../../constants');

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

    // join = async playerId => {
    //     return roomsLib.updateOne(this.id, )
    // };
}

module.exports = asyncRoom;
