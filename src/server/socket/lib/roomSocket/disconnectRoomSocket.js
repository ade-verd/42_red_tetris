'use strict';

const Room = require('../../../lib/rooms/classRoom');
const playerModel = require('../../../models/players/index');

const leaveRoomSocket = require('./leaveRoomSocket');

export const disconnect = async (socket, socketRooms) => {
    if (socketRooms) {
        const player = await playerModel.findOneBySocketId(socket.client.id);
        if (player) {
            const playerId = player._id.toString();
            console.log('ROOMS', socketRooms);
            const rooms = socketRooms.filter(item => {
                return item !== socket.client.id;
            });
            rooms.forEach(async roomId => {
                const room = await new Room({ roomId });
                const updatedRoom = await room.leave(playerId);
                if (updatedRoom.value) {
                    leaveRoomSocket.leave(socket, roomId);
                }
            });
        }
    }
};
