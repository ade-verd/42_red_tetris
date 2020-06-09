import { ACTIONS } from '../../middleware/handleSocket';

export const fieldUpdate = (dispatch, field, piece) => {
    if (!field || !piece.tetromino) { return; }
    dispatch({ action: ACTIONS.REDUCE, type: 'UPDATE', piece, dispatch });
};
