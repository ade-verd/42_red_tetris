import { ACTIONS } from '../../middleware/handleSocket';

export const logOut = dispatch => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'USER_LOGOUT',
    });
};
