import { ACTIONS } from '../middleware/handleSocket';

export const joinRoomPayload = (roomId, playerId) => ({
    room_id: roomId,
    player_id: playerId,
});

export const emitJoinRoom = (store, roomId) => {
    const state = store.getState();
    const playerId = state.usr.id;

    store.dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:join',
        data: joinRoomPayload(roomId, playerId),
    });
};

export const onRoomJoined = store => {
    store.dispatch({
        action: ACTIONS.LISTEN,
        event: 'rooms:joined',
        fn: payload => {
            store.dispatch({
                action: ACTIONS.REDUCE,
                type: 'ROOM_JOINED',
                roomId: payload.payload.room_id,
                error: payload.error,
            });
        },
    });
};
