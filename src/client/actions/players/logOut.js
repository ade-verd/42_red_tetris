import { ACTIONS } from '../../middleware/handleSocket';
import { removeUserCookie } from './userCookie';

export const logOut = dispatch => {
    removeUserCookie();
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'USER_LOGOUT',
    });
};
