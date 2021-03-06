'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { toast } from 'react-toastify';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    handleError,
    getStatusPayload,
    emitGameOver,
    updateSpectrumOnGameOver,
    onGameOver,
    onGameWon,
} from '../../../../src/client/actions/game/status';

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
            if (action.event === 'status:gameWon:broadcast')
                PAYLOAD = { ...PAYLOAD, winnerId: '01' };
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
            ...getStatusPayload('01', '02'),
            winnerId: '01',
            error: null,
        };
    });

    it('should handle socket payload error', () => {
        const warningStub = sandbox.stub(toast, 'warning');
        const errorStub = sandbox.stub(toast, 'error');

        handleError('ValidationError: test', 'errorName');
        expect(warningStub.args).to.deep.equal([
            ['Game status payload one field is missing', { autoClose: 5000 }],
        ]);

        handleError('Error: test', 'errorName');
        expect(errorStub.args).to.deep.equal([['Error while sending status', { autoClose: 6000 }]]);
    });

    it('should get status payload', () => {
        const PLAYER_ID = '0000000000000000002';
        const ROOM_ID = '0000000000000000001';

        const payload = getStatusPayload(PLAYER_ID, ROOM_ID);

        expect(payload).to.deep.equal({
            player_id: PLAYER_ID,
            room_id: ROOM_ID,
        });
    });

    it('should dispatch status emitter', () => {
        const initialState = {
            usr: { id: PAYLOAD.player_id, roomId: PAYLOAD.room_id },
        };
        const store = mockStore(initialState);
        delete PAYLOAD.error;
        delete PAYLOAD.winnerId;

        emitGameOver(store, store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'status:gameOver',
                data: PAYLOAD,
            },
        ]);
    });

    it('should dispatch SPECTRUM_SET_GAMEOVER action', () => {
        const initialState = {};
        const store = mockStore(initialState);

        updateSpectrumOnGameOver(store.dispatch, { player_id: '01' });

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SPECTRUM_SET_GAMEOVER',
                playerId: '01',
            },
        ]);
    });

    it('should dispatch on game over status listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onGameOver(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SPECTRUM_SET_GAMEOVER',
                playerId: '01',
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'status:gameOver:broadcast',
                fn: 'FUNCTION',
            },
        ]);
    });

    it('should dispatch on game won status listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onGameWon(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'GAMEWON',
                winnerId: PAYLOAD.winnerId,
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_DROPTIME',
                dropTime: null,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'status:gameWon:broadcast',
                fn: 'FUNCTION',
            },
        ]);
    });

    it('should not dispatch on game won status listener if error', () => {
        const initialState = {};
        const store = mockStore(initialState);
        PAYLOAD = { ...PAYLOAD, error: 'defined' };

        onGameWon(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'status:gameWon:broadcast',
                fn: 'FUNCTION',
            },
        ]);
    });
});
