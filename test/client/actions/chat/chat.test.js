'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import { newDate } from '../../../../src/client/helpers/utils/date';
import {
    createChatPayload,
    emitChatMessage,
    addMessageToState,
    onChatMessageReceived,
} from '../../../../src/client/actions/chat/chat';

describe('client/actions/chat/chat', () => {
    const sandbox = sinon.createSandbox();
    // To ignore 'Error: Actions may not have an undefined "type" property'
    const addTypePropertyMiddleware = store => next => action => {
        let typedAction = action;

        if (!action.type) typedAction = { ...action, type: 'DEFINED' };

        const res = next(typedAction);

        return res;
    };
    const listenerCallbackMiddleware = store => next => action => {
        let callbackedAction = action;

        if (action.fn) {
            action.fn('PAYLOAD');
            callbackedAction = { ...action, fn: 'FUNCTION' };
        }

        const res = next(callbackedAction);

        return res;
    };
    const middlewares = [addTypePropertyMiddleware, listenerCallbackMiddleware];

    let mockStore;
    beforeEach(() => {
        mockStore = configureStore(middlewares);
        sandbox.restore();
    });

    it('should get chat payload', () => {
        const ARGS = {
            roomId: '0000000000000000001',
            playerId: '0000000000000000002',
            playerName: 'BOT',
            msg: 'message',
            date: null,
        };

        let payload = createChatPayload(ARGS);
        expect(payload).to.deep.equal({
            fromPlayerId: ARGS.playerId,
            fromPlayerName: ARGS.playerName,
            toRoomId: ARGS.roomId,
            message: ARGS.msg,
            date: newDate(ARGS.date).valueOf(),
        });

        ARGS.roomId = null;
        payload = createChatPayload(ARGS);
        expect(payload).to.deep.equal({
            fromPlayerId: ARGS.playerId,
            fromPlayerName: ARGS.playerName,
            toRoomId: 'lobby',
            message: ARGS.msg,
            date: newDate(ARGS.date).valueOf(),
        });
    });

    it('should dispatch chat emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const ARGS = {
            roomId: '0000000000000000001',
            playerId: '0000000000000000002',
            playerName: 'BOT',
            msg: 'message',
            date: null,
        };

        emitChatMessage(store.dispatch, ARGS);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'chat:message:send',
                data: {
                    fromPlayerId: ARGS.playerId,
                    fromPlayerName: ARGS.playerName,
                    toRoomId: ARGS.roomId,
                    message: ARGS.msg,
                    date: newDate(ARGS.date).valueOf(),
                },
            },
        ]);
    });

    it('should dispatch CHAT_MESSAGE_RECEIVED action', () => {
        const initialState = {};
        const store = mockStore(initialState);

        addMessageToState(store.dispatch, 'PAYLOAD');

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'CHAT_MESSAGE_RECEIVED',
                payload: 'PAYLOAD',
                error: undefined,
            },
        ]);
    });

    it('should dispatch chat listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onChatMessageReceived(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'CHAT_MESSAGE_RECEIVED',
                payload: 'PAYLOAD',
                error: undefined,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'chat:message:broadcasted',
                fn: 'FUNCTION',
            },
        ]);
    });
});
