'use strict';

const roomsLib = require('../../models/rooms');

const { GAME_STATUS } = require('../../../constants');

export const start = async roomId => {
    return roomsLib.updateOne(roomId, { game_status: GAME_STATUS.PLAYING });
};

export const pause = async roomId => {
    return roomsLib.updateOne(roomId, { game_status: GAME_STATUS.PAUSE });
};

export const resume = async roomId => {
    return roomsLib.updateOne(roomId, { game_status: GAME_STATUS.PLAYING });
};

export const stop = async roomId => {
    return roomsLib.updateOne(roomId, { game_status: GAME_STATUS.WAITING });
};
