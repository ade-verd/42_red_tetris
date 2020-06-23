import { ACTIONS } from '../../middlewares/handleSocket';

export const updateGameStatus = (dispatch) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'UPDATE_ROWS_SCORE'});
};
