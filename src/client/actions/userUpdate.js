import { store } from '../index.js';
import { ACTIONS } from '../middleware/handleSocket';

const userUpdate = (userId, name) => {
    store.dispatch({
        action: ACTIONS.REDUCE,
        type: 'USER_UPDATE',
        userId,
        name,
    });
};

export { userUpdate };
