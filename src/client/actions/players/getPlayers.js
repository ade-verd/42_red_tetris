import { ACTIONS } from '../../middlewares/handleSocket';

export const getPlayersPayload = playersIds => ({
    players_ids: playersIds,
});

export const emitGetPlayers = (dispatch, playersIds) => {
    dispatch({
        action: ACTIONS.EMIT,
        event: 'players:players:get',
        type: 'players:players:get',
        data: getPlayersPayload(playersIds),
    });
};

export const updateStatePlayersNames = (dispatch, payload) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'UPDATE_PLAYERS_NAMES',
        players: payload.players,
        error: payload.error,
    });
};

export const onGotPlayers = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'players:players:got',
        type: 'players:players:got',
        fn: payload => {
            updateStatePlayersNames(dispatch, payload);
        },
    });
};
