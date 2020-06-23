import { ACTIONS } from '../../middlewares/handleSocket';
import { getUserCookie } from '../players/userCookie';
import { checkSocketId } from '../players/updateSocketId';

export const socketIoConnect = dispatch => {
    dispatch({ action: ACTIONS.CONNECT });
};

export const dispatchReduceSaveSocket = (dispatch, socket) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'SAVE_SOCKET',
        socket,
    });
};

export const onSocketConnect = dispatch => {
    const socket = dispatch({ action: ACTIONS.GET_SOCKET });

    dispatch({
        action: ACTIONS.LISTEN,
        event: 'connect',
        fn: () => {
            dispatchReduceSaveSocket(dispatch, socket);
        },
    });

    const cookie = getUserCookie();
    checkSocketId(dispatch, socket, cookie);
};
