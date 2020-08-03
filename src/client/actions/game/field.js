import { ACTIONS } from '../../middlewares/handleSocket';

export const resetState = dispatch => {
    dispatch({ action: ACTIONS.REDUCE, type: 'RESET' });
};

export const updateField = store => {
    const { dispatch } = store;
    const {
        fld: { field },
        pce: piece,
    } = store.getState();

    if (!field || !piece.tetromino || !piece.projection) return;

    dispatch({ action: ACTIONS.REDUCE, type: 'UPDATE' });
};
