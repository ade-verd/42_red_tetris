import { ACTIONS } from '../../middlewares/handleSocket';
import notify from '../notifications';

import { emitGameAction } from '../game/gameAction';

import { GAME_ACTIONS } from '../../../constants';

export const handleError = (error, errorFieldName) => {
    if (error.startsWith('ValidationError')) {
        notify({ type: 'warning', msg: 'Game reset payload one field is missing' });
    } else {
        notify({ type: 'error', msg: 'Error while reseting the game' });
    }
    console.error(`[gameReset action][${errorFieldName}]`, error);
};

export const getGameResetPayload = roomId => {
    return {
        room_id: roomId,
    };
};

export const emitGameReset = store => {
    const {
        usr: { roomId },
    } = store.getState();

    store.dispatch({
        action: ACTIONS.EMIT,
        event: 'game:reset',
        data: getGameResetPayload(roomId),
    });
};

export const onGameReset = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'game:reseted',
        fn: payload => {
            if (payload && payload.error) return handleError(payload.error, 'creationError');
            dispatch({ action: ACTIONS.REDUCE, type: 'RESET' });
        },
    });
};

export const resetGame = (store, isAdmin = false) => {
    store.dispatch({ action: ACTIONS.REDUCE, type: 'RESET', isAdmin });

    if (isAdmin) {
        emitGameReset(store);
        emitGameAction(store, GAME_ACTIONS.STOP);
    }
};
