'use strict';

import { expect } from 'chai';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    getPlayersPayload,
    emitGetPlayers,
    updateStatePlayersNames,
    onGotPlayers,
} from '../../../../src/client/actions/players/getPlayers';

describe('client/actions/players/getPlayers', () => {
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

    it('should get players payload', () => {
        const payload = getPlayersPayload([]);
        expect(payload).to.deep.equal({
            players_ids: [],
        });
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

    it('should dispatch getPlayers emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);

        emitGetPlayers(store.dispatch, []);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'players:players:get',
                data: getPlayersPayload([]),
            },
        ]);
    });

    it('should dispatch getPlayers listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onGotPlayers(store.dispatch);

        const actions = store.getActions();
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
                event: 'players:players:got',
                fn: 'FUNCTION',
            },
        ]);
    });
});
