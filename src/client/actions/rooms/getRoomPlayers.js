import { ACTIONS } from '../../middleware/handleSocket';

export const getRoomPlayersPayload = roomId => ({
    room_id: roomId,
});

export const emitGetRoomPlayers = (dispatch, roomId) =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:players:get',
        data: getRoomPlayersPayload(roomId),
    });

export const onGotRoomPlayers = store => {
    store.dispatch({
        action: ACTIONS.LISTEN,
        event: 'rooms:got_active',
        fn: payload => {
            store.dispatch({
                action: ACTIONS.REDUCE,
                type: 'UPDATE_ACTIVE_ROOMS',
                store,
                rooms: payload.rooms,
                lobby: payload.lobby,
                fnUpdatePlayers: emitGetRoomPlayers,
                error: payload.error,
            });
        },
    });
};
