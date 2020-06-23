import { ACTIONS } from '../../middlewares/handleSocket';
import { removeUserCookie } from './userCookie';

export const emitDisconnect = dispatch =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'disconnecting',
    });

export const updateStateAtLogout = dispatch => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'USER_LOGOUT',
    });
};

export const logOut = dispatch => {
    removeUserCookie();
    emitDisconnect(dispatch);
    updateStateAtLogout(dispatch);
};
