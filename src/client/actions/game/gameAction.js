import { ACTIONS } from '../../middlewares/handleSocket';
import { GAME_ACTIONS } from '../../../constants';

import { store } from '../../store/store';

export const gameActionPayload = (roomId, action) => ({
    room_id: roomId,
    action,
});

export const emitGameAction = (dispatch, action) => {
    const {
        usr: { roomId },
    } = store.getState();

    dispatch({
        action: ACTIONS.EMIT,
        event: 'games:action:run',
        type: 'games:action:run',
        data: gameActionPayload(roomId, action),
    });
};

export const onGameAction = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'games:action:ran',
        type: 'games:action:ran',
        fn: payload => {
            // TO DO
            console.log('[onGameAction] /! Reducer not implemented', payload);
        },
    });
};
