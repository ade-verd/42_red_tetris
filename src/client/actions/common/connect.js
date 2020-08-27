import { ACTIONS } from '../../middlewares/handleSocket';

export const socketIoConnect = dispatch => {
    dispatch({ action: ACTIONS.CONNECT });
};

export const setSocket = (dispatch, socket) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'SET_SOCKET',
        socket,
    });
};

export const onSocketConnect = dispatch => {
    const socket = dispatch({ action: ACTIONS.GET_SOCKET });

    dispatch({
        action: ACTIONS.LISTEN,
        event: 'connect',
        fn: () => {
            setSocket(dispatch, socket);
        },
    });
};
