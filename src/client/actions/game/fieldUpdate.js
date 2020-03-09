import { ACTIONS } from '../../middleware/handleSocket';

export const fieldUpdate = (dispatch, piece) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'update', piece: piece });
};
