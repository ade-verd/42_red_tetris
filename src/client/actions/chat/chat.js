import { ACTIONS } from '../../middlewares/handleSocket';

import { newDate } from '../../helpers/utils/date';

export const createChatPayload = ({ playerId, playerName, roomId, msg, date }) => ({
    fromPlayerId: playerId,
    fromPlayerName: playerName,
    toRoomId: roomId || 'lobby',
    message: msg,
    date: newDate(date).valueOf(),
});

export const emitChatMessage = (dispatch, payload) => {
    dispatch({
        action: ACTIONS.EMIT,
        type: 'chat:message:send',
        event: 'chat:message:send',
        data: createChatPayload(payload),
    });
};

export const addMessageToState = (dispatch, payload) => {
    dispatch({
        action: ACTIONS.REDUCE,
        type: 'CHAT_MESSAGE_RECEIVED',
        payload,
        error: payload.error,
    });
};

export const onChatMessageReceived = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        type: 'chat:message:broadcasted',
        event: 'chat:message:broadcasted',
        fn: payload => {
            addMessageToState(dispatch, payload);
        },
    });
};
