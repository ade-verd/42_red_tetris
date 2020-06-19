'use strict';

const roomsLib = require('../../models/rooms');

const { GAME_STATUS } = require('../../../constants');

const start = async roomId => {
    return roomsLib.updateOne(roomId, { game_status: GAME_STATUS.PLAYING });
};

const pause = async roomId => {
    return roomsLib.updateOne(roomId, { game_status: GAME_STATUS.PAUSE });
};

const resume = async roomId => {
    return roomsLib.updateOne(roomId, { game_status: GAME_STATUS.PLAYING });
};

const stop = async roomId => {
    return roomsLib.updateOne(roomId, { game_status: GAME_STATUS.WAITING });
};

module.exports = {
    start,
    pause,
    resume,
    stop,
};
