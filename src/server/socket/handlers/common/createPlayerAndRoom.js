'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const playerSocket = require('../players/createPlayer.js');
const roomSocket = require('../rooms/createRoom.js');

const schema = {
    player_name: Joi.string().required(),
    room_name: Joi.string().required(),
};

const ON_EVENT = 'players_rooms:create_join';
const EMIT_EVENT = 'players:created';

export const createPlayerAndRoom = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        const player = await playerSocket.createNewPlayer(socket, { name: payload.player_name });

        if (player && player._id) {
            await roomSocket.createNewRoom(socket, {
                room_name: payload.room_name,
                admin_id: player._id.toString(),
            });
        }
    },
);
