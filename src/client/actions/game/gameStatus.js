import { ACTIONS } from '../../middleware/handleSocket';

export const updateGameStatus = (dispatch) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'UPDATE_ROWS_SCORE'});
};
