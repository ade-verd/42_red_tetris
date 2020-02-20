'use strict';

const playersLib = require('../../models/players');

class asyncPlayer {
    constructor({ name, playerId = null }) {
        if (playerId) {
            this.id = playerId;
            return this;
        }
        return (async () => {
            const insertedPlayer = await playersLib.insertOne({ name });
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
