import { store } from '../index.js';
import { ACTIONS } from '../middleware/handleSocket';

const roomUpdate = roomId => {
    store.dispatch({
        action: ACTIONS.REDUCE,
        type: 'ROOM_UPDATE',
        roomId,
    });
};

export default {
    roomUpdate,
};
