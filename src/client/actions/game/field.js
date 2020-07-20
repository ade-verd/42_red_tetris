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
