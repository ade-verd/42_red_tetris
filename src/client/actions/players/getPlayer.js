import { ACTIONS } from '../../middleware/handleSocket';

export const getPlayerPayload = playerId => ({
    player_id: playerId,
});

export const emitGetPlayer = (dispatch, playerId) =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'players:player:get',
        data: getPlayerPayload(playerId),
    });

export const onGotPlayer = store => {
    store.dispatch({
        action: ACTIONS.LISTEN,
        event: 'players:player:got',
        fn: payload => {
            store.dispatch({
                action: ACTIONS.REDUCE,
                type: 'UPDATE_PLAYERS_NAMES',
                store,
                players: [payload.player],
                error: payload.error,
            });
        },
    });
};
