'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { toast } from 'react-toastify';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import { GAME_ACTIONS } from '../../../../src/constants';
import {
    handleError,
    getGameResetPayload,
    emitGameReset,
    onGameReset,
    resetGame,
} from '../../../../src/client/actions/game/gameReset';

describe('client/actions/game/gameReset', () => {
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
            action.fn(PAYLOAD);
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
        PAYLOAD = {
            ...getGameResetPayload('01'),
            error: null,
        };
    });

    it('should handle socket payload error', () => {
        const warningStub = sandbox.stub(toast, 'warning');
        const errorStub = sandbox.stub(toast, 'error');

        handleError('ValidationError: test', 'errorName');
        expect(warningStub.args).to.deep.equal([
            ['Game reset payload one field is missing', { autoClose: 5000 }],
        ]);

        handleError('Error: test', 'errorName');
        expect(errorStub.args).to.deep.equal([
            ['Error while reseting the game', { autoClose: 6000 }],
        ]);
    });

    it('should get gameReset payload', () => {
        const ROOM_ID = '0000000000000000001';

        const payload = getGameResetPayload(ROOM_ID);

        expect(payload).to.deep.equal({ room_id: ROOM_ID });
    });

    it('should dispatch gameReset emitter', () => {
        const initialState = {
            usr: { roomId: 'defined' },
        };
        const store = mockStore(initialState);

        emitGameReset(store);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'game:reset',
                data: { room_id: 'defined' },
            },
        ]);
    });

    it('should dispatch gameReset listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onGameReset(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'RESET',
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'game:reseted',
                fn: 'FUNCTION',
            },
        ]);
    });

    it('should not dispatch gameReset listener if error', () => {
        const initialState = {};
        const store = mockStore(initialState);
        PAYLOAD = { ...PAYLOAD, error: 'defined' };

        onGameReset(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'game:reseted',
                fn: 'FUNCTION',
            },
        ]);
    });

    it('should dispatch RESET action (isAdmin false)', () => {
        const initialState = {};
        const store = mockStore(initialState);

        resetGame(store);
        const actions = store.getActions();
        expect(actions).to.deep.equal([{ action: ACTIONS.REDUCE, type: 'RESET', isAdmin: false }]);
    });

    it('should dispatch RESET action (isAdmin true)', () => {
        const initialState = {
            usr: { roomId: 'defined' },
        };
        const store = mockStore(initialState);

        resetGame(store, true);
        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'RESET',
                isAdmin: true,
            },
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'game:reset',
                data: { room_id: 'defined' },
            },
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'games:action:run',
                data: { room_id: 'defined', action: GAME_ACTIONS.STOP },
            },
        ]);
    });
});
