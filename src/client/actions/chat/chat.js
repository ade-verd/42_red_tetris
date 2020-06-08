import { ACTIONS } from '../../middleware/handleSocket';

export const createChatPayload = ({ playerId, playerName, roomId, msg }) => ({
    fromPlayerId: playerId,
    fromPlayerName: playerName,
    toRoomId: roomId || 'lobby',
    message: msg,
    date: Date.now(),
});

export const emitChatMessage = (dispatch, payload) =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'chat:message:send',
        data: createChatPayload(payload),
    });

export const onChatMessageReceived = dispatch => {
    dispatch({
        action: ACTIONS.LISTEN,
        event: 'chat:message:broadcasted',
        fn: payload => {
            dispatch({
                action: ACTIONS.REDUCE,
                type: 'CHAT_MESSAGE_RECEIVED',
                payload,
                error: payload.error,
            });
        },
    });
};
