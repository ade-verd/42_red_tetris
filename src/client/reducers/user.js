'use strict';

const handleUserUpdate = (state, action) => {
    return {
        ...state,
        id: action.error ? null : action.player._id,
        name: action.error ? null : action.player.name,
        roomId: null,
    };
};

const handleUserLogOut = state => {
    const player = {
        _id: null,
        name: null,
    };
    return handleUserUpdate(state, { player });
};

const handleRoomUpdate = (state, action) => {
    return {
        ...state,
        roomId: action.error ? null : action.roomId,
    };
};

const handleUserCookieSettings = (state, action) => {
    return {
        ...state,
        isUserCookieEnable: action.isUserCookieEnable === true,
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
        case 'USER_LOGOUT':
            return handleUserLogOut(state);
        case 'USER_COOKIE_SETTINGS':
            return handleUserCookieSettings(state, action);
        default:
            return state;
    }
};

export default reducer;
