import { ACTIONS } from '../../middleware/handleSocket';

export const emitGetActiveRooms = dispatch =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:get_active',
    });

export const onGotActiveRooms = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'rooms:players:got',
        fn: payload => {
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'UPDATE_PLAYERS_NAMES',
                players: payload.players,
                error: payload.error,
            });
        },
    });
};
