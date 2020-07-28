import { ACTIONS } from '../../middlewares/handleSocket';

export const emitGetActiveRooms = dispatch =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:get_active',
        type: 'rooms:get_active',
    });

export const updateStatePlayersNames = (dispatch, payload) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'UPDATE_PLAYERS_NAMES',
        players: payload.players,
        error: payload.error,
    });
};

export const onGotActiveRooms = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'rooms:players:got',
        type: 'rooms:players:got',
        fn: payload => {
            updateStatePlayersNames(dispatch, payload);
        },
    });
};
