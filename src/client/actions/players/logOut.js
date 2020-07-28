import { ACTIONS } from '../../middlewares/handleSocket';

export const emitDisconnect = dispatch =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'log:out',
        type: 'log:out',
    });

export const updateStateAtLogout = dispatch => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'USER_LOGOUT',
    });
};

export const logOut = dispatch => {
    emitDisconnect(dispatch);
    updateStateAtLogout(dispatch);
};
