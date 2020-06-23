import { ACTIONS } from '../../middlewares/handleSocket';
import { setUserCookie } from './userCookie';

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

export const checkSocketId = (dispatch, socket, cookie) => {
    if (!cookie) return;

    setTimeout(() => {
        if (cookie.socketId !== socket.id) {
            console.log('[checkUserCookie] socketId has to be updated');

            emitUpdateSocketId(dispatch, cookie._id);
            setUserCookie({ ...cookie, id: cookie._id, socketId: socket.id });
        }
    }, 1000);
};
