'use strict';

const { ObjectId } = require('mongodb');

const Room = require('../../../lib/rooms/classRoom');
const playerModel = require('../../../models/players/index');

const leaveRoomSocket = require('./leaveRoomSocket');

export const disconnect = async (socket, socketRooms) => {
    if (socketRooms) {
        const player = await playerModel.findOneBySocketId(socket.client.id);
        if (player) {
            const playerId = player._id.toString();
            const rooms = socketRooms.filter(item => {
                return item !== socket.client.id;
            });
            console.log('[DISCONNECT]', rooms);
            rooms.forEach(async roomId => {
                if (ObjectId.isValid(roomId)) {
                    const room = await new Room({ roomId });
                    const updatedRoom = await room.leave(playerId);
                    if (updatedRoom.value) {
                        leaveRoomSocket.leave(socket, roomId);
                    }
                }
            });
        }
    }
};
