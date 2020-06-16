'use strict';

import _ from 'lodash';

import { ObjectId } from 'mongodb';

import playersModels from '../../../models/players';
import * as getActiveRooms from '../../handlers/rooms/getActiveRooms';
import Room from '../../../lib/rooms/classRoom';

export const checkConnectedSocket = async io => {
    const ioRooms = io.sockets.adapter.rooms;
    console.log('[ioRooms]', ioRooms);

    const mongoRoomsCursor = await getActiveRooms.find();
    await mongoRoomsCursor.forEach(async mongoRoom => {
        const mongoRoomId = mongoRoom._id.toString();
        if (ioRooms[mongoRoomId]) {
            await checkPlayers(ioRooms[mongoRoomId], mongoRoom);
        } else {
            await disconnectRoom(mongoRoomId);
        }
    });
};

const checkPlayers = async (ioRoom, mongoRoom) => {
    const playersIds = mongoRoom.players_ids.map(id => new ObjectId(id));
    const mongoPlayers = await playersModels.find({ _id: { $in: playersIds } }, { socket_id: 1 });

    await mongoPlayers.forEach(async player => {
        console.log('[checkPlayers]', { player: player });
        const playerSocketId = _.get(ioRoom, ['sockets', player.socket_id]);
        if (!playerSocketId) {
            await unsetPlayer(mongoRoom._id.toString(), player._id.toString());
        }
    });
};

const unsetPlayer = async (mongoRoomId, playerId) => {
    console.log('[checkConnectedSocket] unsetPlayer', { room: mongoRoomId, player: playerId });
    const room = await new Room({ roomId: mongoRoomId });
    await room.leave(playerId);
};

const disconnectRoom = async mongoRoomId => {
    console.log('[checkConnectedSocket] disconnectRoom', { room: mongoRoomId });
    const room = await new Room({ roomId: mongoRoomId });
    await room.offline();
    await getActiveRooms.emitActiveRooms();
};
