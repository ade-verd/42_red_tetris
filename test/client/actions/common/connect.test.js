'use strict';

import { expect } from 'chai';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import { socketIoConnect, onSocketConnect } from '../../../../src/client/actions/common/connect';
import { setSocket } from '../../../../src/client/actions/players/updateSocketId';

describe('client/actions/common/connect', () => {
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
            action.fn();
            callbackedAction = { ...action, fn: 'FUNCTION' };
        }

        const res = next(callbackedAction);

        return res;
    };
    const middlewares = [addTypePropertyMiddleware, listenerCallbackMiddleware];

    let mockStore;
    beforeEach(() => {
        mockStore = configureStore(middlewares);
    });

    it('should dispatch socket connection', () => {
        const initialState = {};
        const store = mockStore(initialState);

        socketIoConnect(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.CONNECT,
                type: 'DEFINED',
            },
        ]);
    });

    it('should dispatch SET_SOCKET action', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const SOCKET = '0001';

        setSocket(store.dispatch, SOCKET);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_SOCKET',
                socket: SOCKET,
            },
        ]);
    });

    it('should dispatch socket connect listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onSocketConnect(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.GET_SOCKET,
                type: 'DEFINED',
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_SOCKET',
                socket: { action: 'get_socket', type: 'DEFINED' },
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'connect',
                fn: 'FUNCTION',
            },
        ]);
    });
});
