import { ACTIONS } from '../../middleware/handleSocket';

export const firstRender = dispatch => {
    dispatch({ action: ACTIONS.REDUCE, type: 'FIRST_RENDER' });
};
