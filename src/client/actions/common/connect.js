import { ACTIONS } from '../../middlewares/handleSocket';

import { setSocket } from '../players/updateSocketId';

export const socketIoConnect = dispatch => {
    dispatch({ action: ACTIONS.CONNECT });
};

export const onSocketConnect = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'connect',
        fn: () => {
            setSocket(dispatch);
        },
    });
};
