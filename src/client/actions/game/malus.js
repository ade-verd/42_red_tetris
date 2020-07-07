import { ACTIONS } from '../../middlewares/handleSocket';

const getMalusPayload = (roomId, malus) => {
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

export const onMalus = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'malus:sent',
        fn: payload => {
            dispatch({ action: ACTIONS.REDUCE, type: 'UPDATE', malus: payload.malus });
        },
    });
};
