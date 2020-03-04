'use strict';

const handleUserUpdate = (state, action) => {
    return {
        ...state,
        id: action.userId,
        name: action.name,
    };
};

const handleRoomUpdate = (state, action) => {
    return {
        ...state,
        roomId: action.roomId,
    };
};

const reducer = (state = {}, action) => {
    console.log('[userReducer] State', state);

    switch (action.type) {
        case 'USER_UPDATE':
            return handleUserUpdate(state, action);
        case 'ROOM_UPDATE':
            return handleRoomUpdate(state, action);
        default:
            return state;
    }
};

export default reducer;
