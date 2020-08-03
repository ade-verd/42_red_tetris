'use strict';

import { expect } from 'chai';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import { resetState, updateField } from '../../../../src/client/actions/game/field';

describe('client/actions/game/field', () => {
    const middlewares = [];

    let mockStore;
    beforeEach(() => {
        mockStore = configureStore(middlewares);
    });

    it('should dispatch RESET action', () => {
        const initialState = {};
        const store = mockStore(initialState);

        resetState(store.dispatch);

        const actions = store.getActions();
        const expectedPayload = { action: ACTIONS.REDUCE, type: 'RESET' };
        expect(actions).to.deep.equal([expectedPayload]);
    });

    it('should dispatch UPDATE action', () => {
        const initialState = {
            fld: { field: 'defined' },
            pce: { tetromino: 'defined', projection: 'defined' },
        };
        const store = mockStore(initialState);

        updateField(store);

        const actions = store.getActions();
        const expectedPayload = { action: ACTIONS.REDUCE, type: 'UPDATE' };
        expect(actions).to.deep.equal([expectedPayload]);
    });

    it('should not dispatch UPDATE action', () => {
        const initialState = {
            fld: { field: undefined },
            pce: { tetromino: undefined, projection: undefined },
        };
        const store = mockStore(initialState);

        updateField(store);

        const actions = store.getActions();
        expect(actions).to.deep.equal([]);
    });
});
