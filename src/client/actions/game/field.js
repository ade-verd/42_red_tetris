import { ACTIONS } from '../../middlewares/handleSocket';
import { store } from '../../store/store';

export const resetState = dispatch => {
    dispatch({ action: ACTIONS.REDUCE, type: 'RESET' });
};

export const updateField = dispatch => {
    const {
        fld: { field },
        pce: piece,
    } = store.getState();
    if (!field || !piece.tetromino || !piece.projection) return;

    dispatch({ action: ACTIONS.REDUCE, type: 'UPDATE' });
};

export const startGame = (dispatch, elementToFocus) => {
    resetState(dispatch);
    dispatch({ action: ACTIONS.REDUCE, type: 'GET_TETROMINO' });
    dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 });
    elementToFocus.current.focus();
};
