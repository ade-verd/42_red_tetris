'use strict';

const gameActions = require('./gameActions.js');

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
}

module.exports = Game;
