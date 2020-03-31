import { ACTIONS } from '../../middleware/handleSocket';

export const socketIoConnect = dispatch => {
    dispatch({ action: ACTIONS.CONNECT });
};

export const onSocketConnect = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'connect',
        fn: () => {
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'SAVE_SOCKET',
                socket: dispatch({ action: ACTIONS.GET_SOCKET }),
            });
        },
    });
};
