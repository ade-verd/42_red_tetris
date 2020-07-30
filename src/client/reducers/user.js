'use strict';

import notify from '../actions/notifications';

const handleUserUpdate = (state, action) => {
    return {
        ...state,
        id: action.error ? null : action.player._id,
        name: action.error ? null : action.player.name,
        roomId: null,
    };
};

const handleUserLogOut = state => {
    const stateUpdated = handleRoomUpdate(state, { roomId: null, roomName: null });
    return handleUserUpdate(stateUpdated, { player: { _id: null, name: null } });
};

const handleRoomUpdate = (state, action) => {
    return {
        ...state,
        roomId: action.error ? null : action.roomId,
        roomName: action.error ? null : action.roomName,
    };
};

const handleUpdateActiveRooms = (state, action) => {
    if (action.error !== undefined || !state.roomId || !action.rooms) return state;

    const isRoomStillActive = action.rooms.some(room => room._id === state.roomId);

    if (isRoomStillActive) return state;
    const error = 'Error: the room has been disconnected';
    notify({ type: 'error', msg: error });
    return handleRoomUpdate(state, { error });
};

const handleSaveSocket = (state, action) => {
    return {
        ...state,
        socketId: action.socket.id,
    };
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'PLAYER_CREATED':
            return handleUserUpdate(state, action);
        case 'LEAVE_ROOM':
        case 'ROOM_JOINED':
        case 'ROOM_CREATED':
            return handleRoomUpdate(state, action);
        case 'UPDATE_ACTIVE_ROOMS':
            return handleUpdateActiveRooms(state, action);
        case 'USER_LOGOUT':
            return handleUserLogOut(state);
        case 'SAVE_SOCKET':
            return handleSaveSocket(state, action);
        default:
            return state;
    }
};

export default reducer;
