'use strict';

const playersLib = require('../../models/players');

class asyncPlayer {
    constructor({ socketId, name, playerId = null, roomId = null }) {
        if (playerId) {
            this.id = playerId;
            return this;
        }
        return (async () => {
            const insertedPlayer = await playersLib.insertOne({
                socket_id: socketId,
                name,
                room_id: roomId,
            });
            this.id = insertedPlayer._id.toString();
            return this;
        })();
    }

    find = async projection => {
        return playersLib.findOneById(this.id, projection);
    };

    update = async fieldsToUpdate => {
        return playersLib.updateOne(this.id, fieldsToUpdate);
    };
}

module.exports = asyncPlayer;
