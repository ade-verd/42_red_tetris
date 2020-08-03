'use strict';

const helpers = require('../../eventHelpers');

const disconnectRoomSocket = require('../../lib/roomSocket/disconnectRoomSocket');
const getActiveRooms = require('../rooms/getActiveRooms.js');

const config = require('../../../config');

const schema = null;

const ON_EVENT_DISCONNECTING = 'disconnecting';
const ON_EVENT_LOGOUT = 'log:out';
const EMIT_EVENT = 'disconnected';
const FUNCTION_NAME = '[socketDisconnect]';

const _disconnect = async socket => {
    const socketRooms = Object.keys(socket.rooms);
    try {
        await disconnectRoomSocket.disconnect(socket, socketRooms);
        console.log(FUNCTION_NAME, socket.client.id, 'disconnected');
        socket.emit(EMIT_EVENT, { socket_id: socket.client.id });
        await getActiveRooms.emitActiveRooms(socket);
    } catch (err) {
        socket.emit(EMIT_EVENT, { socketRooms, error: err.toString() });
        console.error(FUNCTION_NAME, { socketRooms, err });
    }
};

const socketDisconnecting = helpers.createEvent(
    ON_EVENT_DISCONNECTING,
    EMIT_EVENT,
    schema,
    async socket => {
        if (config.env.isTestEnv) return;
        await _disconnect(socket);
    },
);

const socketLogout = helpers.createEvent(ON_EVENT_LOGOUT, EMIT_EVENT, schema, async socket => {
    await _disconnect(socket);
});

module.exports = {
    socketDisconnecting,
    socketLogout,
};
