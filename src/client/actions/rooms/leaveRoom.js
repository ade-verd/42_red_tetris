import { ACTIONS } from '../../middlewares/handleSocket';

export const leaveRoomPayload = (roomId, playerId) => ({
    room_id: roomId,
    player_id: playerId,
});

export const emitLeaveRoom = store => {
    const { id: playerId, roomId } = store.getState().usr;

    store.dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:leave',
        data: leaveRoomPayload(roomId, playerId),
    });
    store.dispatch({
        action: ACTIONS.REDUCE,
        type: 'LEAVE_ROOM',
        roomId: null,
        roomName: null,
    });
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
