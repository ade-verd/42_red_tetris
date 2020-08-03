'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    getScorePayload,
    emitScore,
    emitGetHighscores,
    updateHighscoresState,
    onHighscores,
} from '../../../../src/client/actions/highscores/highscores';

describe('client/actions/game/status', () => {
    const sandbox = sinon.createSandbox();
    let PAYLOAD;
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
            action.fn({ highscores: [] });
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
        PAYLOAD = getScorePayload('01', 'BOT', 42);
    });

    it('should get score payload', () => {
        const PLAYER_ID = '0000000000000000002';
        const PLAYER_NAME = 'BOT';
        const SCORE = 42;

        const payload = getScorePayload(PLAYER_ID, PLAYER_NAME, SCORE);

        expect(payload).to.deep.equal({
            player_id: PLAYER_ID,
            player_name: PLAYER_NAME,
            score: SCORE,
        });
    });

    it('should dispatch score emitter', () => {
        const initialState = {
            usr: { id: PAYLOAD.player_id, name: PAYLOAD.player_name },
            gme: { score: PAYLOAD.score },
        };
        const store = mockStore(initialState);

        emitScore(store, store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'score:send',
                data: PAYLOAD,
            },
        ]);
    });

    it('should dispatch getHighscores emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);

        emitGetHighscores(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'highscores:request',
            },
        ]);
    });

    it('should dispatch UPDATE_HIGHSCORES action', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const pld = { highscores: [] };

        updateHighscoresState(store.dispatch, pld);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'UPDATE_HIGHSCORES',
                highscores: pld.highscores,
            },
        ]);
    });

    it('should dispatch highscores listener', () => {
        const initialState = {};
        const store = mockStore(initialState);
        PAYLOAD = { ...PAYLOAD, error: 'defined' };

        onHighscores(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'UPDATE_HIGHSCORES',
                highscores: [],
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'highscores:requested',
                fn: 'FUNCTION',
            },
        ]);
    });
});
