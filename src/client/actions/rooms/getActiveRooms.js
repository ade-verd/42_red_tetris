import { ACTIONS } from '../../middlewares/handleSocket';

import checkSocketId from '../players/updateSocketId';
import { emitPing } from '../server';

export const emitGetActiveRooms = dispatch =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:get_active',
    });

export const updateStatePlayersNames = (dispatch, payload) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'UPDATE_PLAYERS_NAMES',
        players: payload.players,
        error: payload.error,
    });
};

export const onGotActiveRooms = store => {
    const { dispatch } = store;

    dispatch({
        action: ACTIONS.LISTEN,
        event: 'rooms:players:got',
        fn: payload => {
            updateStatePlayersNames(dispatch, payload);
            recurrentActions(store);
        },
    });
};

const recurrentActions = store => {
    const { dispatch } = store;

    checkSocketId({ dispatch, user: store.getState().usr });
    emitPing(dispatch);
};
