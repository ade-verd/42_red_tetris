'use strict';

const roomsLib = require('../../models/rooms');
const getPiecesLib = require('../pieces/getPieces');
const roomInOut = require('./roomInOut');

const { GAME_STATUS, MAX_PLAYERS, PIECES_NUMBER_AT_ROOM_CREATION } = require('../../../constants');

class asyncRoom {
    constructor({ roomName, roomCreaterId, roomId = null }) {
        if (roomId) {
            this.id = roomId;
            return this;
        }
        return (async () => {
            const room = await roomInOut.joinOrCreate(roomName, roomCreaterId);
            Object.assign(this, { ...room });
            this.id = room._id.toString();
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
        return roomInOut.join(this.id, playerId);
    };

    leave = async playerId => {
        return roomInOut.leave(this.id, playerId);
    };
}

module.exports = asyncRoom;
