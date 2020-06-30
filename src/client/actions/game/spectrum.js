import { ACTIONS } from '../../middlewares/handleSocket';

export const getSpectrumPayload = (roomId, playerId, field) => {
    return {
        room_id: roomId,
        player_id: playerId,
        field: field,
    };
};

// Don't like this way, but I need field state right after it updated (with action.allStates)
export const asyncEmitSpectrum = (dispatch, roomId, playerId) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'EMIT_SPECTRUM', roomId, playerId });
};

export const emitSpectrum = (dispatch, roomId, playerId, field) => {
    dispatch({
        action: ACTIONS.EMIT,
        event: 'spectrum:update',
        data: getSpectrumPayload(roomId, playerId, field),
    });
};

export const onSpectrum = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'spectrum:updated',
        fn: payload => {
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'SET_SPECTRUM',
                playerId: payload.player_id,
                spectrum: payload.spectrum,
                error: payload.error,
            });
        },
    });
};
