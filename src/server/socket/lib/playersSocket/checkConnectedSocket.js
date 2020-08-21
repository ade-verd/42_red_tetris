'use strict';

const get = require('lodash/get');

const { ObjectId } = require('mongodb');

const playersModels = require('../../../models/players');
const getActiveRooms = require('../../handlers/rooms/getActiveRooms');
const Room = require('../../../lib/rooms/classRoom');

const checkConnectedSocket = async io => {
    const ioRooms = io.sockets.adapter.rooms;
    console.log('[ioRooms]', ioRooms);

    const mongoRoomsCursor = await getActiveRooms.find();
    await mongoRoomsCursor.forEach(async mongoRoom => {
        const mongoRoomId = mongoRoom._id.toString();
        if (ioRooms[mongoRoomId]) {
            await thisFunctions._checkPlayers(ioRooms[mongoRoomId], mongoRoom);
        } else {
            await thisFunctions._disconnectRoom(mongoRoomId);
        }
    });
};

const _checkPlayers = async (ioRoom, mongoRoom) => {
    const playersIds = mongoRoom.players_ids.map(id => new ObjectId(id));
    const mongoPlayers = await playersModels.find({ _id: { $in: playersIds } }, { socket_id: 1 });

    await mongoPlayers.forEach(async player => {
        console.log('[checkPlayers]', { player: player });
        const playerSocketId = get(ioRoom, ['sockets', player.socket_id]);
        if (!playerSocketId) {
            await thisFunctions._unsetPlayer(mongoRoom._id.toString(), player._id.toString());
        }
    });
};

const _unsetPlayer = async (mongoRoomId, playerId) => {
    console.log('[checkConnectedSocket] unsetPlayer', { room: mongoRoomId, player: playerId });
    const room = await new Room({ roomId: mongoRoomId });
    await room.leave(playerId);
};

const _disconnectRoom = async mongoRoomId => {
    console.log('[checkConnectedSocket] disconnectRoom', { room: mongoRoomId });
    const room = await new Room({ roomId: mongoRoomId });
    await room.offline();
    await getActiveRooms.emitActiveRooms();
};

const thisFunctions = { checkConnectedSocket, _checkPlayers, _disconnectRoom, _unsetPlayer };
module.exports = thisFunctions;
