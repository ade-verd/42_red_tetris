import { ACTIONS } from '../../middlewares/handleSocket';

import { checkSocketId } from '../players/updateSocketId';

export const socketIoConnect = dispatch => {
    dispatch({ action: ACTIONS.CONNECT });
};

export const onSocketConnect = store => {
    store.dispatch({
        action: ACTIONS.LISTEN,
        event: 'connect',
        fn: () => {
            checkSocketId({ store });
        },
    });
};
