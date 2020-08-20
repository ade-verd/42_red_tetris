'use strict';

import { get } from 'lodash-es';

import notify from '../actions/notifications';

const handleError = (state, error, errorFieldName) => {
    console.error(`[chat reducer][${errorFieldName}]`, error);
    return {
        ...state,
    };
};

const handleMessageReceived = (state, action) => {
    if (action.error !== undefined) {
        notify({ type: 'error', msg: action.error });
        return handleError(state, action.error, 'chatError');
    }

    const roomId = action.payload.toRoomId;
    const previousRoomMessages = get(state, ['msg', roomId], []);
    const roomMessages = [...previousRoomMessages, action.payload];

    return {
        ...state,
        msg: { ...state.msg, [roomId]: roomMessages },
    };
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'CHAT_MESSAGE_RECEIVED':
            return handleMessageReceived(state, action);
        default:
            return state;
    }
};

export default reducer;
