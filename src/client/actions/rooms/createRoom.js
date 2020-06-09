import { ACTIONS } from '../../middleware/handleSocket';
import { emitGetRandomTetriminos } from '../game/getTetriminos'

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
            const test = emitGetRandomTetriminos(dispatch, payload.room_id, 1, 20);
            console.log("TOTO =", test);
        },
    });
};
