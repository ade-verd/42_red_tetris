import { ACTIONS } from '../../middlewares/handleSocket';

export const createRoomPayload = (roomName, roomCreaterId) => ({
    room_name: roomName,
    admin_id: roomCreaterId,
});

export const emitCreateRoom = (dispatch, roomName, roomCreaterId) =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'rooms:create',
        data: createRoomPayload(roomName, roomCreaterId),
    });

export const onRoomCreated = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'rooms:created',
        fn: payload => {
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'ROOM_CREATED',
                roomId: payload.room_id,
                roomName: payload.room_name,
                error: payload.error,
            });
        },
    });
};
