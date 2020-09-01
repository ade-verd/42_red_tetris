import { ACTIONS } from '../../middlewares/handleSocket';

export const updateSocketIdPayload = playerId => ({ player_id: playerId });

export const emitUpdateSocketId = (dispatch, playerId) =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'players:socket:update',
        data: updateSocketIdPayload(playerId),
    });

export const setSocket = (dispatch, _socket) => {
    const socket = _socket || dispatch({ action: ACTIONS.GET_SOCKET });

    dispatch({
        action: ACTIONS.REDUCE,
        type: 'SET_SOCKET',
        socket,
    });
};

export const checkSocketId = ({ store, _socket, _user }) => {
    const { dispatch } = store;
    const socket = _socket || dispatch({ action: ACTIONS.GET_SOCKET });
    const user = _user || store.getState().usr;

    if (!socket) {
        dispatch({ action: ACTIONS.CONNECT });
    }

    if (socket && user.socketId !== socket.id) {
        emitUpdateSocketId(dispatch, user.id);
        setSocket(dispatch, socket);
    }
};

export default checkSocketId;
