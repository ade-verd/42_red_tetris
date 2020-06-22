'use strict';

const { ObjectId } = require('mongodb');

const Player = require('../../../lib/players/classPlayer');
const Room = require('../../../lib/rooms/classRoom');
const playerModel = require('../../../models/players/index');

const changeRoomSocket = require('./changeRoomSocket');

const LOG_PREFIX = '[disconnect]';

const _unsetPlayerSocketId = async playerId => {
    const player = await new Player({ playerId });
    await player.update({ socket_id: null });
};

const _leaveRooms = async (socket, rooms, playerId) => {
    await Promise.all(
        rooms.map(async roomId => {
            if (ObjectId.isValid(roomId)) {
                const room = await new Room({ roomId });
                const updatedRoom = await room.leave(playerId);
                if (updatedRoom.value) {
                    changeRoomSocket.change(socket, null);
                }
            } else {
                changeRoomSocket.change(socket, null);
            }
        }),
    );
};

const disconnect = async (socket, socketRooms) => {
    if (!socketRooms) return;

    const player = await playerModel.findOneBySocketId(socket.client.id);
    if (player) {
        const playerId = player._id.toString();
        const rooms = socketRooms.filter(item => {
            return item !== socket.client.id;
        });
        await Promise.all([
            thisFunctions._leaveRooms(socket, rooms, playerId),
            thisFunctions._unsetPlayerSocketId(playerId),
        ]);
    }
};

const thisFunctions = { disconnect, _unsetPlayerSocketId, _leaveRooms };
module.exports = thisFunctions;
