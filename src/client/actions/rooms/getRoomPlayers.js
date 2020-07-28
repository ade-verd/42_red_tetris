import { ACTIONS } from '../../middlewares/handleSocket';

import { emitGetPlayers } from '../players/getPlayers';
import { dispatchReduceSaveSocket } from '../common/connect';

export const getRoomPlayersPayload = roomId => ({
    room_id: roomId,
});

export const emitGetRoomPlayers = (dispatch, roomId) => {
    dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:players:get',
        data: getRoomPlayersPayload(roomId),
    });
};

export const dispatchReduceUpdateActiveRooms = (store, payload) => {
    store.dispatch({
        action: ACTIONS.REDUCE,
        type: 'UPDATE_ACTIVE_ROOMS',
        store,
        rooms: payload.rooms,
        lobby: payload.lobby,
        fnUpdatePlayers: emitGetPlayers,
        error: payload.error,
    });
};

export const onGotRoomPlayers = store => {
    store.dispatch({
        action: ACTIONS.LISTEN,
        event: 'rooms:got_active',
        fn: payload => {
            dispatchReduceUpdateActiveRooms(store, payload);
        },
    });
};
