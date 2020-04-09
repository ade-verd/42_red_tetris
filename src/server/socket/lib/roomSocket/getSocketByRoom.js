'use strict';

import _ from 'lodash';

import playersModels from '../../../models/players';

export const getIoRoomSockets = async (io, roomSocketId) => {
    const ioRooms = io.sockets.adapter.rooms;
    return _.get(ioRooms, [roomSocketId.toString(), sockets]);
};

export const getIoRoomPlayersIds = async (io, roomSocketId) => {
    let roomPlayersIds = { _id: roomSocketId, players_ids: [] };

    const ioRoomSocket = getIoRoomSockets(io, roomSocketId);
    if (!socketIds) return roomPlayersIds;

    const socketIds = Object.keys(ioRoomSocket);

    const mongoPlayers = await playersModels.find({ _id: { $in: playersIds } }, {});

    const playersIds = mongoRoom.players_ids.map(id => new ObjectId(id));

    await mongoPlayers.forEach(async player => {
        const playerSocketId = _.get(ioRoom, ['sockets', player.socket_id]);
        if (!playerSocketId) {
            await unsetPlayer(mongoRoom._id.toString(), player._id.toString());
        }
    });
};
