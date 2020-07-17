import { ACTIONS } from '../../middlewares/handleSocket';

import { emitGameActionStart } from './gameAction';

const getGameStartPayload = (roomId, pieces, index) => {
    return {
        room_id: roomId,
        pieces,
        index,
    };
};

const emitGameStart = (dispatch, roomId, pieces, index) => {
    dispatch({
        action: ACTIONS.EMIT,
        event: 'game:start',
        data: getGameStartPayload(roomId, pieces, index),
    });
};

export const onGameStart = (dispatch, elementToFocus) => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'game:started',
        fn: payload => {
            dispatch({ action: ACTIONS.REDUCE, type: 'RESET' });
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_PIECES', pieces: payload.pieces });
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_INDEX', index: payload.index });
            dispatch({ action: ACTIONS.REDUCE, type: 'GET_TETROMINO' });
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 });
            elementToFocus.current.focus();
        },
    });
};

export const startGame = (dispatch, roomId, pieces, index, elementToFocus) => {
    emitGameStart(dispatch, roomId, pieces, index);
    dispatch({ action: ACTIONS.REDUCE, type: 'RESET' });
    dispatch({ action: ACTIONS.REDUCE, type: 'GET_TETROMINO' });
    dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 });
    emitGameActionStart(dispatch, roomId);

    elementToFocus.current.focus();
};
