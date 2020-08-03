'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    getTetriminosPayload,
    emitGetRandomTetriminos,
    callback,
    onGetRandomTetriminos,
} from '../../../../src/client/actions/game/getTetriminos';

describe('client/actions/game/gameStart', () => {
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
            const payload = { pieces: [], error: null };
            action.fn(payload);
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

    it('should get getTetriminos payload', () => {
        const ROOM_ID = '0000000000000000001';
        const PIECE_POS = 0;
        const PIECE_AMOUNT = 1;

        const payload = getTetriminosPayload(ROOM_ID, PIECE_POS, PIECE_AMOUNT);

        expect(payload).to.deep.equal({
            room_id: ROOM_ID,
            pieces_position: PIECE_POS,
            number: PIECE_AMOUNT,
        });
    });

    it('should dispatch getTetriminos emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const ROOM_ID = '0000000000000000001';
        const PIECE_POS = 0;
        const PIECE_AMOUNT = 1;

        emitGetRandomTetriminos(store.dispatch, ROOM_ID, PIECE_POS, PIECE_AMOUNT);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'tetriminos:get_random',
                data: { room_id: ROOM_ID, pieces_position: PIECE_POS, number: PIECE_AMOUNT },
            },
        ]);
    });

    it('should dispatch getTetriminos listener', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const payload = { pieces: [], error: null };

        onGetRandomTetriminos(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_PIECES',
                pieces: payload.pieces,
                error: payload.error,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'tetriminos:get_random',
                fn: 'FUNCTION',
            },
        ]);
    });
});
