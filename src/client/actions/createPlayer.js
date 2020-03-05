import { ACTIONS } from '../middleware/handleSocket';

export const createPlayerPayload = name => ({ name });

export const emitCreatePlayer = (dispatch, playerName) =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'players:create',
        data: createPlayerPayload(playerName),
    });

export const onPlayerCreated = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'players:created',
        fn: payload => {
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'PLAYER_CREATED',
                player: payload.player,
                error: payload.error,
            });
        },
    });
};
