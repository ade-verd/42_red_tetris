'use strict';

const helpers = require('../../eventHelpers');

const roomsLib = require('../../../models/rooms');

const { GAME_STATUS } = require('../../../../constants');

const schema = {};

const _getActiveRooms = async (socket, payload) => {
    try {
        const regex = `^(?!${GAME_STATUS.OFFLINE})`;
        const projection = { room_name: 1, players_ids: 1, game_status: 1, settings: 1 };
        const activeRoomsCursor = await roomsLib.findRoomsByGameStatus(regex, projection);
        socket.emit('rooms:get_active', await activeRoomsCursor.toArray());
    } catch (err) {
        socket.emit('rooms:get_active', { error: err.toString() });
        console.error('[getActiveRooms]', err);
    }
};

export const getActiveRooms = helpers.createEvent(
    'rooms:get_active',
    schema,
    async (socket, payload) => {
        await _getActiveRooms(socket, payload);
    },
);
