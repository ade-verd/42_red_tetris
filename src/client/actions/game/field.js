import { ACTIONS } from '../../middlewares/handleSocket';

export const updateField = (dispatch, field, piece) => {
    if (!field || !piece.tetromino || !piece.projection) return;

    dispatch({ action: ACTIONS.REDUCE, type: 'UPDATE', dispatch });
};
