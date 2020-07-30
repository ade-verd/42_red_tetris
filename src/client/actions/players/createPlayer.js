import { ACTIONS } from '../../middlewares/handleSocket';

export const createPlayerPayload = name => ({ name });

export const dispatchReducePlayerCreated = (dispatch, payload) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'PLAYER_CREATED',
        player: payload.player,
        error: payload.error,
    });
};

export const emitCreatePlayer = (dispatch, playerName) =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'players:create',
        data: createPlayerPayload(playerName),
    });

export const onPlayerCreated = ({ dispatch, getState }) => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'players:created',
        fn: payload => {
            dispatchReducePlayerCreated(dispatch, payload);
        },
    });
};
