'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { toast } from 'react-toastify';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    handleError,
    getMalusPayload,
    emitMalus,
    onMalus,
} from '../../../../src/client/actions/game/malus';
import { mapValues } from 'lodash';

describe('client/actions/game/malus', () => {
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
            ...getMalusPayload('01', 1),
            error: null,
        };
    });

    it('should handle socket payload error', () => {
        const warningStub = sandbox.stub(toast, 'warning');
        const errorStub = sandbox.stub(toast, 'error');

        handleError('ValidationError: test', 'errorName');
        expect(warningStub.args).to.deep.equal([
            ['Malus payload one field is missing', { autoClose: 5000 }],
        ]);

        handleError('Error: test', 'errorName');
        expect(errorStub.args).to.deep.equal([
            ['Error while sending the malus', { autoClose: 6000 }],
        ]);
    });

    it('should get malus payload', () => {
        const ROOM_ID = '0000000000000000001';
        const MALUS = 1;

        const payload = getMalusPayload(ROOM_ID, MALUS);

        expect(payload).to.deep.equal({
            room_id: ROOM_ID,
            malus: MALUS,
        });
    });

    it('should dispatch malus emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);

        emitMalus(store.dispatch, PAYLOAD.room_id, PAYLOAD.malus);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'malus:send',
                data: { room_id: PAYLOAD.room_id, malus: PAYLOAD.malus },
            },
        ]);
    });

    it('should dispatch malus listener', () => {
        const initialState = {
            gme: { level: 2 },
        };
        const store = mockStore(initialState);

        onMalus(store);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_DROPTIME',
                dropTime: null,
            },
            {
                action: ACTIONS.REDUCE,
                type: 'UPDATE',
                malus: PAYLOAD.malus,
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_POS',
                pos: { x: 0, y: -PAYLOAD.malus },
                collided: false,
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_DROPTIME',
                dropTime: 1000 / initialState.gme.level,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'malus:sent',
                fn: 'FUNCTION',
            },
        ]);
    });

    it('should not dispatch malus listener if error', () => {
        const initialState = {};
        const store = mockStore(initialState);
        PAYLOAD = { ...PAYLOAD, error: 'defined' };

        onMalus(store);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'malus:sent',
                fn: 'FUNCTION',
            },
        ]);
    });
});
