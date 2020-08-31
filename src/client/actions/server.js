import { ACTIONS } from '../middlewares/handleSocket';

export const emitPing = dispatch =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'ping',
    });
