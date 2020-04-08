'use strict';

const helpers = require('../../eventHelpers');

const disconnectRoomSocket = require('../../lib/roomSocket/disconnectRoomSocket');
const getActiveRooms = require('../rooms/getActiveRooms.js');

const schema = null;

const ON_EVENT = 'disconnecting';
const EMIT_EVENT = 'disconnected';
const FUNCTION_NAME = '[socketDisconnect]';

const _disconnecting = async (socket, socketRooms) => {
    try {
        console.log(FUNCTION_NAME, socket.client.id, 'try to disconnect');
        await disconnectRoomSocket.disconnect(socket, socketRooms);
        await getActiveRooms.emitActiveRooms(socket);
        console.log(FUNCTION_NAME, socket.client.id, 'disconnected');
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
        const socketRooms = Object.keys(socket.rooms);
        await _disconnecting(socket, socketRooms);
    },
);
