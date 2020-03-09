import { ACTIONS } from '../../middleware/handleSocket';
import { GAME_ACTIONS } from '../../../constants';

export const gameActionPayload = (roomId, action) => ({
    room_id: roomId,
    action,
});

export const emitGameActionStart = (dispatch, roomId) => {
    dispatch({
        action: ACTIONS.EMIT,
        event: 'games:action:run',
        data: gameActionPayload(roomId, GAME_ACTIONS.START),
    });
};

export const onGameAction = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'games:action:ran',
        fn: payload => {
            // TO DO
            console.log('[onGameAction] /! Reducer not implemented', payload);
        },
    });
};
