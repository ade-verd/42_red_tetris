'use strict';

const leaveRoom = require('./leaveRoomSocket');

const EMIT_EVENT = 'rooms:socket:joined';

const join = (socket, roomId) => {
    const socketRooms = Object.keys(socket.rooms);
    if (roomId !== 'lobby' && socketRooms.includes('lobby')) {
        leaveRoom.leave(socket, 'lobby');
    }
    socket.join(roomId, () => {
        socket.emit(EMIT_EVENT, { roomId });
        console.log(
            'JOIN',
            `The socket ${socket.client.id} joined the room ${roomId}`,
            Object.keys(socket.rooms),
        );
    });
};

module.exports = { join };
