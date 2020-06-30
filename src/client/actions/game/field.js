import { ACTIONS } from '../../middlewares/handleSocket';

export const resetState = dispatch => {
    dispatch({ action: ACTIONS.REDUCE, type: 'RESET' });
};

export const updateField = (dispatch, field, piece) => {
    if (!field || !piece.tetromino || !piece.projection) return;

    dispatch({ action: ACTIONS.REDUCE, type: 'UPDATE', piece, dispatch });
};

export const startGame = (dispatch, elementToFocus) => {
    resetState(dispatch);
    dispatch({ action: ACTIONS.REDUCE, type: 'GET_TETROMINO' });
    dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 });
    elementToFocus.current.focus();
};
