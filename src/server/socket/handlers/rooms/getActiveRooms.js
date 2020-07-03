'use strict';

const ioInstance = require('../../ioInstance');

const helpers = require('../../eventHelpers');

const roomsLib = require('../../../models/rooms');
const socketRoomLib = require('../../lib/roomSocket/getSocketByRoom');

const { GAME_STATUS } = require('../../../../constants');

const schema = {};

const ON_EVENT = 'rooms:get_active';
const EMIT_EVENT = 'rooms:got_active';
const FUNCTION_NAME = '[getActiveRooms]';

const find = async () => {
    const regex = `^(?!${GAME_STATUS.OFFLINE})`;
    const projection = { room_name: 1, players_ids: 1, game_status: 1, settings: 1 };
    return roomsLib.findRoomsByGameStatus(regex, projection);
};

const emitActiveRooms = async () => {
    const io = ioInstance.get();
    try {
        const activeRoomsCursor = await find();
        const payload = {
            rooms: await activeRoomsCursor.toArray(),
            lobby: await socketRoomLib.getIoRoomPlayersIds(io, 'lobby'),
        };
        console.log(FUNCTION_NAME, payload);
        io.emit(EMIT_EVENT, payload);
    } catch (err) {
        io.emit(EMIT_EVENT, { error: err.toString() });
        console.log(FUNCTION_NAME, { err });
    }
};

const getActiveRooms = helpers.createEvent(ON_EVENT, EMIT_EVENT, schema, async () => {
    await emitActiveRooms();
});

module.exports = {
    getActiveRooms,
    emitActiveRooms,
    find,
};
