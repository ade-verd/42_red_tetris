import { ACTIONS } from '../../middlewares/handleSocket';
import { GAME_ACTIONS } from '../../../constants';

export const gameActionPayload = (roomId, action) => ({
    room_id: roomId,
    action,
});

export const emitGameAction = (store, action) => {
    const {
        usr: { roomId },
    } = store.getState();

    store.dispatch({
        action: ACTIONS.EMIT,
        event: 'games:action:run',
        data: gameActionPayload(roomId, action),
    });
};

export const onGameAction = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'games:action:ran',
        fn: payload => {
            // TO DO
        },
    });
};
