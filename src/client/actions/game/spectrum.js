import { ACTIONS } from '../../middlewares/handleSocket';

const handleError = (error, errorFieldName) => {
    if (error.startsWith('ValidationError')) {
        notify({ type: 'warning', msg: 'Spectrum payload one field is missing' });
    } else {
        notify({ type: 'error', msg: 'Error while sending spectrum' });
    }
    console.error(`[spectrum action][${errorFieldName}]`, error);
};

export const getSpectrumPayload = (roomId, playerId, playerName, field) => {
    return {
        room_id: roomId,
        player_id: playerId,
        player_name: playerName,
        field: field,
    };
};

export const emitSpectrum = (dispatch, roomId, playerId, playerName, field) => {
    dispatch({
        action: ACTIONS.EMIT,
        event: 'spectrum:update',
        data: getSpectrumPayload(roomId, playerId, playerName, field),
    });
};

export const onSpectrum = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'spectrum:updated',
        fn: payload => {
            if (payload.error) return handleError(payload.error, 'creationError');
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'SET_SPECTRUM',
                playerId: payload.player_id,
                playerName: payload.player_name,
                spectrum: payload.spectrum,
                error: payload.error,
            });
        },
    });
};
