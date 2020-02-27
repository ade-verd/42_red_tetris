'use strict';

const helpers = require('../../eventHelpers');

const roomsLib = require('../../../models/rooms');

const { GAME_STATUS } = require('../../../../constants');

const schema = {};

const ON_EVENT = 'rooms:get_active';
const EMIT_EVENT = 'rooms:got_active';
const FUNCTION_NAME = '[getActiveRooms]';

export const emitActiveRooms = async (socket, payload) => {
    try {
        const regex = `^(?!${GAME_STATUS.OFFLINE})`;
        const projection = { room_name: 1, players_ids: 1, game_status: 1, settings: 1 };
        const activeRoomsCursor = await roomsLib.findRoomsByGameStatus(regex, projection);
        socket.emit(EMIT_EVENT, await activeRoomsCursor.toArray());
    } catch (err) {
        socket.emit(EMIT_EVENT, { error: err.toString() });
        console.error(FUNCTION_NAME, { err });
    }
};

export const getActiveRooms = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await emitActiveRooms(socket, payload);
    },
);
