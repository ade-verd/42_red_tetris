'use strict';

const EMIT_EVENT = 'rooms:socket:left';

export const leave = (socket, roomId) => {
    socket.leave(roomId, () => {
        socket.emit(EMIT_EVENT, { roomId });
    });
};
