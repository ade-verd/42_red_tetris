import { ACTIONS } from '../../middleware/handleSocket';
import { getUserCookie, setUserCookie } from './userCookie';

export const createPlayerPayload = name => ({ name });

const dispatchPlayerCreated = (dispatch, payload) => {
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

export const onPlayerCreated = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'players:created',
        fn: payload => {
            setUserCookie(payload.player, payload.error);
            dispatchPlayerCreated(dispatch, payload);
        },
    });
};

export const checkUserCookie = dispatch => {
    const player = getUserCookie();
    if (player && player._id && player.name) {
        dispatchPlayerCreated(dispatch, { player });
    }
};
