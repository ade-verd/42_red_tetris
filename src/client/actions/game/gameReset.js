import { ACTIONS } from '../../middlewares/handleSocket';

import { store } from '../../store/store';

const getGameResetPayload = roomId => {
    return {
        room_id: roomId,
    };
};

export const emitGameReset = dispatch => {
    const {
        usr: { roomId },
    } = store.getState();

    dispatch({
        action: ACTIONS.EMIT,
        event: 'game:reset',
        data: getGameResetPayload(roomId),
    });
};

export const onGameReset = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'game:reseted',
        fn: () => {
            dispatch({ action: ACTIONS.REDUCE, type: 'RESET' });
        },
    });
};

export const resetGame = (dispatch, isAdmin = false) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'RESET', isAdmin });
};
