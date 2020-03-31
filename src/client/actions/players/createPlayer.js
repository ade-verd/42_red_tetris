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

export const onPlayerCreated = store => {
    store.dispatch({
        action: ACTIONS.LISTEN,
        event: 'players:created',
        fn: payload => {
            setUserCookie(store.getState().usr, payload.player, payload.error);
            dispatchPlayerCreated(store.dispatch, payload);
        },
    });
};

export const checkUserCookie = store => {
    const cookie = getUserCookie();

    if (cookie && cookie._id && cookie.name) {
        dispatchPlayerCreated(store.dispatch, { player: cookie });
    }
};
