'use strict';

const { ObjectId } = require('mongodb');

const Player = require('../../../lib/players/classPlayer');
const Room = require('../../../lib/rooms/classRoom');
const playerModel = require('../../../models/players/index');

const leaveRoomSocket = require('./leaveRoomSocket');

const LOG_PREFIX = '[disconnect]';

const _unsetPlayerSocketId = async playerId => {
    const player = await new Player({ playerId });
    await player.update({ socket_id: null });
};

const _leaveRooms = async (socket, rooms, playerId) => {
    console.log(LOG_PREFIX, 'rooms', rooms);
    rooms.forEach(async roomId => {
        if (ObjectId.isValid(roomId)) {
            const room = await new Room({ roomId });
            const updatedRoom = await room.leave(playerId);
            if (updatedRoom.value) {
                leaveRoomSocket.leave(socket, roomId);
            }
        } else {
            leaveRoomSocket.leave(socket, roomId);
        }
    });
};

export const disconnect = async (socket, socketRooms) => {
    if (socketRooms) {
        const player = await playerModel.findOneBySocketId(socket.client.id);
        if (player) {
            const playerId = player._id.toString();
            const rooms = socketRooms.filter(item => {
                return item !== socket.client.id;
            });
            await Promise.all([
                _leaveRooms(socket, rooms, playerId),
                _unsetPlayerSocketId(playerId),
            ]);
        }
    }
};
