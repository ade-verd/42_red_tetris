import { ACTIONS } from '../../middlewares/handleSocket';

export const getPlayerPayload = playerId => ({
    player_id: playerId,
});

export const emitGetPlayer = (dispatch, playerId) => {
    dispatch({
        action: ACTIONS.EMIT,
        event: 'players:player:get',
        data: getPlayerPayload(playerId),
    });
};

export const updateStatePlayerName = (dispatch, payload) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'UPDATE_PLAYERS_NAMES',
        players: [payload.player],
        error: payload.error,
    });
};

export const onGotPlayer = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'players:player:got',
        fn: payload => {
            updateStatePlayerName(dispatch, payload);
        },
    });
};
