'use strict';

const EMIT_EVENT_JOINED = 'rooms:socket:joined';
const EMIT_EVENT_LEFT = 'rooms:socket:left';

const move = (socket, { from, to }) => {
    if (to) {
        const roomId = to;
        socket.join(roomId, () => {
            socket.emit(EMIT_EVENT_JOINED, { roomId });
            console.log(
                '[socketRooms] JOIN',
                `The socket ${socket.client.id} joined the room ${roomId}`,
                Object.keys(socket.rooms),
            );
        });
    }
    if (from) {
        const roomId = from;
        socket.leave(roomId, () => {
            socket.emit(EMIT_EVENT_LEFT, { roomId });
            console.log(
                '[socketRooms] LEAVE',
                `The socket ${socket.client.id} left the room ${roomId}`,
                Object.keys(socket.rooms),
            );
        });
    }
};

const change = (socket, toRoomId) => {
    const socketRooms = Object.keys(socket.rooms);
    const from = socketRooms && socketRooms.length > 1 ? socketRooms[1] : null;
    const movePayload = { from, to: toRoomId };
    move(socket, movePayload);
};

module.exports = { change };
