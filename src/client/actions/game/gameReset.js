import { ACTIONS } from '../../middlewares/handleSocket';

import { emitGameOver } from './status';

import { store } from '../../store/store';
import { emitGameAction } from '../game/gameAction';

import { GAME_ACTIONS } from '../../../constants';

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
        type: 'game:reset',
        data: getGameResetPayload(roomId),
    });
};

export const onGameReset = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'game:reseted',
        type: 'game:reseted',
        fn: () => {
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
