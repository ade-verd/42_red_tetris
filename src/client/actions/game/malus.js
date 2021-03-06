import { ACTIONS } from '../../middlewares/handleSocket';
import notify from '../notifications';

export const handleError = (error, errorFieldName) => {
    if (error.startsWith('ValidationError')) {
        notify({ type: 'warning', msg: 'Malus payload one field is missing' });
    } else {
        notify({ type: 'error', msg: 'Error while sending the malus' });
    }
    console.error(`[malus action][${errorFieldName}]`, error);
};

export const getMalusPayload = (roomId, malus) => {
    return {
        room_id: roomId,
        malus,
    };
};

export const emitMalus = (dispatch, roomId, malus) => {
    dispatch({
        action: ACTIONS.EMIT,
        event: 'malus:send',
        data: getMalusPayload(roomId, malus),
    });
};

export const onMalus = store => {
    const { dispatch } = store;
    const { gme } = store.getState();

    const level = (gme && gme.level) || 1;
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'malus:sent',
        fn: payload => {
            if (payload.error) return handleError(payload.error, 'creationError');
            // Turning off, then on, while handling malus to avoid side effects
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: null });
            dispatch({ action: ACTIONS.REDUCE, type: 'UPDATE', malus: payload.malus });
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'SET_POS',
                pos: { x: 0, y: -payload.malus },
                collided: false,
            });
            dispatch({ action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 / level });
        },
    });
};
