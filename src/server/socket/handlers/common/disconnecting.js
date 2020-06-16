'use strict';

const helpers = require('../../eventHelpers');

const disconnectRoomSocket = require('../../lib/roomSocket/disconnectRoomSocket');
const getActiveRooms = require('../rooms/getActiveRooms.js');

const config = require('../../../../../src/server/config');

const schema = null;

const ON_EVENT = 'disconnecting';
const EMIT_EVENT = 'disconnected';
const FUNCTION_NAME = '[socketDisconnect]';

const _disconnecting = async (socket, socketRooms) => {
    try {
        await disconnectRoomSocket.disconnect(socket, socketRooms);
        console.log(FUNCTION_NAME, socket.client.id, 'disconnected');
        await getActiveRooms.emitActiveRooms(socket);
    } catch (err) {
        socket.emit(EMIT_EVENT, { socketRooms, error: err.toString() });
        console.error(FUNCTION_NAME, { socketRooms, err });
    }
};

export const socketDisconnecting = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async socket => {
        if (config.env.isTestEnv) return;
        const socketRooms = Object.keys(socket.rooms);
        await _disconnecting(socket, socketRooms);
    },
);
