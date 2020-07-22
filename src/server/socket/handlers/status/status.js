'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');
const ioInstance = require('../../ioInstance');

const playersLib = require('../../../models/players');

const schema = {
    player_id: Joi.string().required(),
    room_id: Joi.string().required(),
    reset: Joi.boolean().required(),
};

const ON_EVENT = 'status:gameOver';
const EMIT_EVENT = 'status:gameWon';
const FUNCTION_NAME = '[playersLib]';

const emitGameWon = async (socket, payload) => {
    const io = ioInstance.get();
    const [playerId, roomId, reset] = [payload.player_id, payload.room_id, payload.reset];

    if (reset) {
        try {
            await playersLib
                .collection()
                .updateMany({ room_id: roomId }, { $set: { game_over: false } });
        } catch (err) {
            socket.emit(EMIT_EVENT, { payload, error: err.toString() });
            console.error(FUNCTION_NAME, { payload, err });
        }
        return;
    }

    try {
        await playersLib.updateOne(playerId, { game_over: true });
        const playersNumber = await playersLib.find({ room_id: roomId }).count();
        const gameOvers = await playersLib.find({ room_id: roomId, game_over: true }).count();

        if (gameOvers === playersNumber - 1) {
            const winner = await playersLib
                .collection()
                .findOne({ room_id: roomId, game_over: false }, { socket_id: 1 });
            io.to(winner.socket_id).emit(EMIT_EVENT);
            console.log('[socket event emited][to:', winner.socket_id, ']', EMIT_EVENT);
            await playersLib
                .collection()
                .updateMany({ room_id: roomId }, { $set: { game_over: false } });
        }
    } catch (err) {
        socket.emit(EMIT_EVENT, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

export const handleWinner = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await emitGameWon(socket, payload);
    },
);
