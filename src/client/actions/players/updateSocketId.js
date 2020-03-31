import { ACTIONS } from '../../middleware/handleSocket';

export const updateSocketIdPayload = playerId => ({ player_id: playerId });

export const emitUpdateSocketId = (dispatch, playerId) =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'players:socket:update',
        data: updateSocketIdPayload(playerId),
    });

export const onSocketIdUpdated = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'players:socket:updated',
        fn: payload => {
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'SOCKET_PLAYER_UPDATED',
                error: payload.error,
            });
        },
    });
};
