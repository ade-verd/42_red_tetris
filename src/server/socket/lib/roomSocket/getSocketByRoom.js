'use strict';

import _ from 'lodash';

export const getIoRoomSockets = (io, roomSocketId) => {
    const ioRooms = io.sockets.adapter.rooms;
    if (roomSocketId) return _.get(ioRooms, [roomSocketId.toString(), sockets]);
    return ioRooms;
};

export const getIoRoomPlayersIds = async (io, roomSocketId) => {
    const ioRoomSocket = getIoRoomSockets(io, roomSocketId);
    console.log('GET_SOCKET_BY_ROOM', JSON.stringify(ioRoomSocket));
};
