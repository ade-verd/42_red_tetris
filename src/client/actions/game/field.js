import { ACTIONS } from '../../middleware/handleSocket';

export const updateField = (dispatch, field, piece) => {
    if (!field || !piece.tetromino || !piece.projection) {
        return;
    }
    dispatch({ action: ACTIONS.REDUCE, type: 'UPDATE', piece, dispatch });
};

export const startGame = dispatch => {
    dispatch({ action: ACTIONS.REDUCE, type: 'RESET' });
    dispatch({ action: ACTIONS.REDUCE, type: 'GET_TETROMINO' });
    dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 });
};
