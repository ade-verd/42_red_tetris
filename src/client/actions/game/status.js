import { ACTIONS } from '../../middlewares/handleSocket';

const handleError = (error, errorFieldName) => {
    if (error.startsWith('ValidationError')) {
        notify({ type: 'warning', msg: 'Game status payload one field is missing' });
    } else {
        notify({ type: 'error', msg: 'Error while sending status' });
    }
    console.error(`[status action][${errorFieldName}]`, error);
};

export const getStatusPayload = (id, roomId) => {
    return {
        player_id: id,
        room_id: roomId,
    };
};

export const emitGameOver = (store, dispatch) => {
    const {
        usr: { id, roomId },
    } = store.getState();

    dispatch({
        action: ACTIONS.EMIT,
        event: 'status:gameOver',
        data: getStatusPayload(id, roomId),
    });
};

export const onGameWon = (dispatch) => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'status:gameWon',
        fn: (payload) => {
            if (payload && payload.error) return handleError(payload.error, 'creationError');
            console.debug('GAME WON !');
            dispatch({ action: ACTIONS.REDUCE, type: 'GAMEWON' });
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: null });
        },
    });
};
