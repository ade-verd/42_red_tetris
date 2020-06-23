import { ACTIONS } from '../../middlewares/handleSocket';

export const firstRender = (dispatch) => {
    dispatch({ action: ACTIONS.REDUCE, type: 'FIRST_RENDER'});
};
