'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { toast } from 'react-toastify';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    handleError,
    getSpectrumPayload,
    emitSpectrum,
    onSpectrum,
} from '../../../../src/client/actions/game/spectrum';

describe('client/actions/game/spectrum', () => {
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
            ...getSpectrumPayload('01', '02', 'BOT', []),
            error: null,
        };
    });

    it('should handle socket payload error', () => {
        const warningStub = sandbox.stub(toast, 'warning');
        const errorStub = sandbox.stub(toast, 'error');

        handleError('ValidationError: test', 'errorName');
        expect(warningStub.args).to.deep.equal([
            ['Spectrum payload one field is missing', { autoClose: 5000 }],
        ]);

        handleError('Error: test', 'errorName');
        expect(errorStub.args).to.deep.equal([
            ['Error while sending spectrum', { autoClose: 6000 }],
        ]);
    });

    it('should get spectrum payload', () => {
        const ROOM_ID = '0000000000000000001';
        const PLAYER_ID = '0000000000000000002';
        const PLAYER_NAME = 'BOT';
        const FIELD = [];

        const payload = getSpectrumPayload(ROOM_ID, PLAYER_ID, PLAYER_NAME, FIELD);

        expect(payload).to.deep.equal({
            room_id: ROOM_ID,
            player_id: PLAYER_ID,
            player_name: PLAYER_NAME,
            field: FIELD,
        });
    });

    it('should dispatch spectrum emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);
        delete PAYLOAD.error;

        emitSpectrum(
            store.dispatch,
            PAYLOAD.room_id,
            PAYLOAD.player_id,
            PAYLOAD.player_name,
            PAYLOAD.field,
        );

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'spectrum:update',
                data: PAYLOAD,
            },
        ]);
    });

    it('should dispatch spectrum listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onSpectrum(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_SPECTRUM',
                playerId: PAYLOAD.player_id,
                playerName: PAYLOAD.player_name,
                spectrum: PAYLOAD.spectrum,
                error: PAYLOAD.error,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'spectrum:updated',
                fn: 'FUNCTION',
            },
        ]);
    });

    it('should not dispatch spectrum listener if error', () => {
        const initialState = {};
        const store = mockStore(initialState);
        PAYLOAD = { ...PAYLOAD, error: 'defined' };

        onSpectrum(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'spectrum:updated',
                fn: 'FUNCTION',
            },
        ]);
    });
});
