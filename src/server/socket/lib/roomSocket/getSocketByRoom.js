'use strict';

const { get } = require('lodash');

const playersModel = require('../../../models/players');

const getIoRoomSockets = (io, roomSocketId) => {
    const ioRooms = io.sockets.adapter.rooms;
    return get(ioRooms, [roomSocketId.toString(), 'sockets'], {});
};

const getIoRoomPlayersIds = async (io, roomSocketId) => {
    const playersIds = { players_ids: [] };

    const socketsIds = Object.keys(getIoRoomSockets(io, roomSocketId));
    if (socketsIds.length) {
        const playersCursor = await playersModel.findAllBySocketIds(
            { socketsIds, roomId: roomSocketId },
            {},
        );
        await playersCursor.forEach(async player => {
            playersIds.players_ids.push(player._id);
        });
    }
    return playersIds;
};

const getIoRoomPlayers = async (io, roomSocketId) => {
    const socketsIds = Object.keys(getIoRoomSockets(io, roomSocketId));
    return playersModel.findAllBySocketIds({ socketsIds, roomId: roomSocketId }, {});
};

module.exports = {
    getIoRoomSockets,
    getIoRoomPlayersIds,
    getIoRoomPlayers,
};
