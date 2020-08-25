'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');
const ioInstance = require('../../ioInstance');

const playersLib = require('../../../models/players');
const socketRoomLib = require('../../lib/roomSocket/getSocketByRoom');

const schema = {
    player_id: Joi.string().required(),
    room_id: Joi.string().required(),
};

const ON_EVENT = 'status:gameOver';
const EMIT_EVENT_GAMEOVER = 'status:gameOver:broadcast';
const EMIT_EVENT_GAMEWON = 'status:gameWon:broadcast';
const FUNCTION_NAME = '[playersLib]';

const emitGameOver = async (socket, payload) => {
    const io = ioInstance.get();

    try {
        io.to(payload.room_id).emit(EMIT_EVENT_GAMEOVER, payload);
    } catch (err) {
        socket.emit(EMIT_EVENT_GAMEOVER, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

const isWinner = async ({ io, roomId }) => {
    const playersCursor = await socketRoomLib.getIoRoomPlayers(io, roomId);
    const playersArray = await playersCursor.toArray();

    const playingPlayers = playersArray.filter(player => player.game_over === false);
    return playingPlayers.length <= 1 ? playingPlayers[0] : null;
};

const emitGameWon = async (socket, payload) => {
    const io = ioInstance.get();
    const [playerId, roomId] = [payload.player_id, payload.room_id];

    try {
        await playersLib.updateOne(playerId, { game_over: true });
        const winner = await thisFunctions.isWinner({ io, roomId });

        if (winner) {
            io.to(roomId).emit(EMIT_EVENT_GAMEWON, { winnerId: winner._id });
            console.log('[socket event emited][to:', roomId, ']', EMIT_EVENT_GAMEWON, {
                winnerId: winner._id,
            });
        }
    } catch (err) {
        socket.emit(EMIT_EVENT_GAMEWON, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

const handleGameOver = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT_GAMEOVER,
    schema,
    async (socket, payload) => {
        thisFunctions.emitGameOver(socket, payload);
        thisFunctions.emitGameWon(socket, payload);
    },
);

const thisFunctions = {
    handleGameOver,
    emitGameWon,
    emitGameOver,
    isWinner,
};

module.exports = thisFunctions;
