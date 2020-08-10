'use strict';

import { expect } from 'chai';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    emitDisconnect,
    updateStateAtLogout,
    logOut,
} from '../../../../src/client/actions/players/logOut';

describe('client/actions/players/getPlayers', () => {
    // To ignore 'Error: Actions may not have an undefined "type" property'
    const addTypePropertyMiddleware = store => next => action => {
        let typedAction = action;

        if (!action.type) typedAction = { ...action, type: 'DEFINED' };

        const res = next(typedAction);

        return res;
    };
    const middlewares = [addTypePropertyMiddleware];

    let mockStore;
    beforeEach(() => {
        mockStore = configureStore(middlewares);
    });

    it('should dispatch logOut emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);

        emitDisconnect(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'log:out',
            },
        ]);
    });

    it('should dispatch USER_LOGOUT action', () => {
        const initialState = {};
        const store = mockStore(initialState);

        updateStateAtLogout(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'USER_LOGOUT',
            },
        ]);
    });

    it('should dispatch logOut', () => {
        const initialState = {};
        const store = mockStore(initialState);

        logOut(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'log:out',
            },
            {
                action: ACTIONS.REDUCE,
                type: 'USER_LOGOUT',
            },
        ]);
    });
});
