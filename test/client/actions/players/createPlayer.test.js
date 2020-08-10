'use strict';

import { expect } from 'chai';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    createPlayerPayload,
    dispatchReducePlayerCreated,
    emitCreatePlayer,
    onPlayerCreated,
} from '../../../../src/client/actions/players/createPlayer';

describe('client/actions/players/createPlayer', () => {
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
            action.fn({ player: 'bot' });
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

    it('should get createPlayer payload', () => {
        const PLAYER_NAME = 'bot';

        const payload = createPlayerPayload(PLAYER_NAME);
        expect(payload).to.deep.equal({
            name: PLAYER_NAME,
        });
    });

    it('should dispatch PLAYER_CREATED action', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const PAYLOAD = { player: 'bot', error: 'none' };

        dispatchReducePlayerCreated(store.dispatch, PAYLOAD);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'PLAYER_CREATED',
                player: 'bot',
                error: 'none',
            },
        ]);
    });

    it('should dispatch createPlayer emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const PLAYER_NAME = 'bot';

        emitCreatePlayer(store.dispatch, PLAYER_NAME);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'players:create',
                data: createPlayerPayload(PLAYER_NAME),
            },
        ]);
    });

    it('should dispatch player created listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onPlayerCreated(store);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'PLAYER_CREATED',
                player: 'bot',
                error: undefined,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'players:created',
                fn: 'FUNCTION',
            },
        ]);
    });
});
