'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');

const getFieldJoi = () => {
    const cell = Joi.array().items(
        Joi.alternatives(Joi.string(), Joi.number()).required(),
        Joi.string().required(),
        Joi.boolean().required(),
    );
    const row = Joi.array().items(cell);
    const field = Joi.array().items(row);

    return field;
};

const schema = {
    room_id: Joi.string().required(),
    player_id: Joi.string().required(),
    player_name: Joi.string().required(),
    field: getFieldJoi(),
};

const ON_EVENT = 'spectrum:update';
const EMIT_EVENT = 'spectrum:updated';

const emitNewSpectrum = async (socket, payload) => {
    const [roomId, playerId, playerName, field] = [
        payload.room_id,
        payload.player_id,
        payload.player_name,
        payload.field,
    ];
    let spectrumIndex = Array(10).fill(false);
    const newSpectrum = field.map(row =>
        row.map((cell, i) => {
            if (spectrumIndex[i]) return 'merged';
            else if (cell[1] === 'merged') {
                spectrumIndex[i] = true;
                return 'merged';
            } else {
                return 'clear';
            }
        }),
    );

    socket
        .to(roomId)
        .emit(EMIT_EVENT, { player_id: playerId, player_name: playerName, spectrum: newSpectrum });
    console.log('[socket event emited][to:', roomId, ']', EMIT_EVENT, {
        player_id: playerId,
        player_name: playerName,
        // spectrum: newSpectrum,
    });
};

export const updateSpectrum = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT,
    schema,
    async (socket, payload) => {
        await emitNewSpectrum(socket, payload);
    },
);
