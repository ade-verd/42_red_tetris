import { store } from '../index.js';
import { ACTIONS } from '../middleware/handleSocket';

const joinRoomPayload = (roomId, playerId) => ({
    room_id: roomId,
    player_id: playerId,
});

const emitJoinRoom = roomId => {
    const state = store.getState();
    const playerId = state.usr.user.id;

    store.dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:join',
        data: joinRoomPayload(roomId, playerId),
    });
};

const onRoomJoined = () => {
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

export default {
    joinRoomPayload,
    emitJoinRoom,
    onRoomJoined,
};
