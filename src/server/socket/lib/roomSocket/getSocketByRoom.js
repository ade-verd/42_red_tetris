'use strict';

import _ from 'lodash';

import playersModel from '../../../models/players';

export const getIoRoomSockets = (io, roomSocketId) => {
    const ioRooms = io.sockets.adapter.rooms;
    return _.get(ioRooms, [roomSocketId.toString(), 'sockets'], {});
};

export const getIoRoomPlayersIds = async (io, roomSocketId) => {
    const playersIds = { players_ids: [] };

    const roomSocketsIds = Object.keys(getIoRoomSockets(io, roomSocketId));
    if (roomSocketsIds.length) {
        const playersCursor = await playersModel.findAllBySocketIds(roomSocketsIds, {});
        await playersCursor.forEach(async player => {
            playersIds.players_ids.push(player._id);
        });
    }
    return playersIds;
};
