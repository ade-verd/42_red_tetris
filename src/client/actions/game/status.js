import { ACTIONS } from '../../middlewares/handleSocket';

import { store } from '../../store/store';

const getStatusPayload = (id, roomId, reset) => {
    return {
        player_id: id,
        room_id: roomId,
        reset,
    };
};

export const emitGameOver = (dispatch, reset = false) => {
    const {
        usr: { id, roomId },
    } = store.getState();

    dispatch({
        action: ACTIONS.EMIT,
        event: 'status:gameOver',
        data: getStatusPayload(id, roomId, reset),
    });
};

export const onGameWon = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'status:gameWon',
        fn: () => {
            console.debug('GAME WON !');
            dispatch({ action: ACTIONS.REDUCE, type: 'GAMEWON' });
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: null });
        },
    });
};
