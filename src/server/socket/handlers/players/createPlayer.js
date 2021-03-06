'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const Player = require('../../../lib/players/classPlayer');
const changeRoomSocket = require('../../lib/roomSocket/changeRoomSocket');
const getActiveRooms = require('../rooms/getActiveRooms');

const schema = {
    name: Joi.string().required(),
};

const ON_EVENT = 'players:create';
const EMIT_EVENT = 'players:created';
const FUNCTION_NAME = '[createPlayer]';

const createNewPlayer = async (socket, payload) => {
    try {
        const newPlayer = await new Player({ socketId: socket.client.id, name: payload.name });
        const player = await newPlayer.find();
        await changeRoomSocket.change(socket, 'lobby');
        socket.emit(EMIT_EVENT, { payload, player });
        await getActiveRooms.emitActiveRooms();
        return player;
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
    return null;
};

const createPlayer = helpers.createEvent(ON_EVENT, EMIT_EVENT, schema, async (socket, payload) => {
    await createNewPlayer(socket, payload);
});

module.exports = {
    createPlayer,
    createNewPlayer,
};
