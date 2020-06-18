'use strict';

const joinRoom = require('./joinRoomSocket');

const EMIT_EVENT = 'rooms:socket:left';

const leave = (socket, roomId) => {
    const socketRooms = Object.keys(socket.rooms);
    if (roomId !== 'lobby' && !socketRooms.includes('lobby')) {
        joinRoom.join(socket, 'lobby');
    }
    socket.leave(roomId, () => {
        socket.emit(EMIT_EVENT, { roomId });
        console.log(
            'LEAVE',
            `The socket ${socket.client.id} left the room ${roomId}`,
            Object.keys(socket.rooms),
        );
    });
};

module.exports = { leave };
