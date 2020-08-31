'use strict';

import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    emitGetActiveRooms,
    updateStatePlayersNames,
    onGotActiveRooms,
} from '../../../../src/client/actions/rooms/getActiveRooms';
import * as checkSocketId from '../../../../src/client/actions/players/updateSocketId';

describe('client/actions/rooms/getActiveRooms', () => {
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
            action.fn({ players: [] });
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

    afterEach(() => {
        sandbox.restore();
    });

    it('should dispatch getActiveRooms emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);

        emitGetActiveRooms(store.dispatch, []);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'rooms:get_active',
            },
        ]);
    });

    it('should dispatch UPDATE_PLAYERS_NAMES action', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const PAYLOAD = { players: [], error: 'none' };

        updateStatePlayersNames(store.dispatch, PAYLOAD);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'UPDATE_PLAYERS_NAMES',
                players: [],
                error: 'none',
            },
        ]);
    });

    it('should dispatch getActiveRooms listener', () => {
        const initialState = { usr: {} };
        const store = mockStore(initialState);

        const checkSocketStub = sandbox.stub(checkSocketId, 'default').returns();

        onGotActiveRooms(store);

        const actions = store.getActions();
        expect(checkSocketStub.args).to.deep.equal([[{ dispatch: store.dispatch, user: {} }]]);
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'UPDATE_PLAYERS_NAMES',
                players: [],
                error: undefined,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'rooms:players:got',
                fn: 'FUNCTION',
            },
        ]);
    });
});
