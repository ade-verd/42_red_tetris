import _ from 'lodash';

import { ACTIONS } from '../../middlewares/handleSocket';

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

export const onRoomJoined = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'rooms:joined',
        fn: payload => {
            console.log('AFF', payload);
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'ROOM_JOINED',
                roomId: _.get(payload, 'payload.room_id'),
                roomName: _.get(payload, 'update.value.room_name'),
                error: payload.error,
            });
        },
    });
};
