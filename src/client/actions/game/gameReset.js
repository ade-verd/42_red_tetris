import { ACTIONS } from '../../middlewares/handleSocket';

import { emitGameOver } from './status';

import { store } from '../../store/store';
import { emitGameAction } from '../game/gameAction';

import { GAME_ACTIONS } from '../../../constants';

const handleError = (error, errorFieldName) => {
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
            if (payload.error) return handleError(payload.error, 'creationError');
            dispatch({ action: ACTIONS.REDUCE, type: 'RESET' });
        },
    });
};

export const resetGame = (dispatch, isAdmin = false) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'RESET', isAdmin });

    if (isAdmin) {
        emitGameReset(dispatch);
        emitGameAction(dispatch, GAME_ACTIONS.STOP);
        // We emit 'true' to force reset game_over fields in database
        emitGameOver(dispatch, true);
    }
};
