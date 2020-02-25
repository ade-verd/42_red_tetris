'use strict';

const gameActions = require('./gameActions.js');
const roomsLib = require('../../models/rooms');

class Game {
    constructor({ roomId }) {
        this.roomId = roomId;
    }

    start = async () => {
        return gameActions.start(this.roomId);
    };

    pause = async () => {
        return gameActions.pause(this.roomId);
    };

    resume = async () => {
        return gameActions.resume(this.roomId);
    };

    stop = async () => {
        return gameActions.stop(this.roomId);
    };

    status = async () => {
        const { game_status: status } = await roomsLib.findOneById(this.roomId, {
            _id: 0,
            game_status: 1,
        });
        return status;
    };
}

module.exports = Game;
