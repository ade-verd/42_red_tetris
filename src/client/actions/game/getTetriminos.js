import { ACTIONS } from '../../middleware/handleSocket';

export const getTetriminosPayload = (roomId, piecePosition, piecesNumber) => {
    return {
        room_id: roomId,
        pieces_position: piecePosition,
        number: piecesNumber,
    };
};

export const emitGetRandomTetriminos = (dispatch, roomId, piecePosition, piecesAmount) => {
    dispatch({
        action: ACTIONS.EMIT,
        event: 'tetriminos:get_random',
        data: getTetriminosPayload(roomId, piecePosition, piecesAmount),
    });
};

export const onGetRandomTetriminos = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'tetriminos:get_random',
        fn: payload => {
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'SET_TETROMINO',
                piece: payload.pieces[0].shape,
                error: payload.error,
            });
        },
    });
};
