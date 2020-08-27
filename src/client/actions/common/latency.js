import { ACTIONS } from '../../middlewares/handleSocket';

import { newDate } from '../../helpers/utils/date';

export const setLatency = (dispatch, latency) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'SET_LATENCY',
        latency,
        at: newDate(),
    });
};

export const onPong = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'pong',
        fn: latency => {
            setLatency(dispatch, latency);
        },
    });
};
