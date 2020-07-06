import { ACTIONS } from '../../middlewares/handleSocket';

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
