'use strict';

const EMIT_EVENT = 'rooms:socket:joined';

export const join = (socket, roomId) => {
    socket.join(roomId, () => {
        socket.emit(EMIT_EVENT, { roomId });
        console.log('JOIN', Object.keys(socket.rooms));
    });
};
