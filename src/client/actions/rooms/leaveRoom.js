import { ACTIONS } from '../../middleware/handleSocket';

export const leaveRoomPayload = (roomId, playerId) => ({
    room_id: roomId,
    player_id: playerId,
});

export const dispatchEmitLeaveRoom = store => {
    const { id: playerId, roomId } = store.getState().usr;

    store.dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:leave',
        data: leaveRoomPayload(roomId, playerId),
    });
};

export const dispatchReduceLeaveRoom = store => {
    store.dispatch({
        action: ACTIONS.REDUCE,
        type: 'LEAVE_ROOM',
        roomId: null,
        roomName: null,
    });
};

export const emitLeaveRoom = store => {
    dispatchEmitLeaveRoom(store);
    dispatchReduceLeaveRoom(store);
};

export const onRoomLeft = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'rooms:left',
        fn: payload => {
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'ROOM_LEFT',
                error: payload.error,
            });
        },
    });
};
