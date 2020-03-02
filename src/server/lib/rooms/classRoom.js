'use strict';

const roomsLib = require('../../models/rooms');
const roomInOut = require('./roomInOut');
const roomPlayers = require('./roomPlayers.js');

class asyncRoom {
    constructor({ roomName, roomCreaterId, roomId = null }) {
        if (roomId) {
            this.id = roomId;
            return this;
        }
        return (async () => {
            const room = await roomInOut.joinOrCreate(roomName, roomCreaterId);
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

    getPlayersName = async () => {
        return roomPlayers.getPlayersNames(this.id);
    };
}

module.exports = asyncRoom;
