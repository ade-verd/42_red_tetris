import { ACTIONS } from '../../middlewares/handleSocket';

import { emitGameActionStart } from './gameAction';
import { store } from '../../store/store';

const getGameStartPayload = (roomId, piece) => {
    return {
        room_id: roomId,
        pieces: piece.pieces,
        index: piece.index,
        nextTetromino: piece.tetromino,
    };
};

const emitGameStart = dispatch => {
    const {
        usr: { roomId },
        pce: piece,
    } = store.getState();

    dispatch({
        action: ACTIONS.EMIT,
        event: 'game:start',
        data: getGameStartPayload(roomId, piece),
    });
};

export const onGameStart = (dispatch, elementToFocus) => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'game:started',
        fn: payload => {
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_PIECES', pieces: payload.pieces });
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_INDEX', index: payload.index - 1 });
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'SET_NEXT_TETROMINO',
                nextTetromino: payload.nextTetromino,
            });
            dispatch({ action: ACTIONS.REDUCE, type: 'GET_TETROMINO' });
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 });
            elementToFocus.current.focus();
        },
    });
};

export const startGame = (dispatch, elementToFocus) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'GET_TETROMINO' });
    dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 });
    emitGameStart(dispatch);
    emitGameActionStart(dispatch);

    elementToFocus.current.focus();
};
