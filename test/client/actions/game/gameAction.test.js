'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    gameActionPayload,
    emitGameAction,
    onGameAction,
} from '../../../../src/client/actions/game/gameAction';

describe('client/actions/game/gameAction', () => {
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
        PAYLOAD = gameActionPayload('01', 'NOTHING');
    });

    it('should get gameAction payload', () => {
        const ROOM_ID = '0000000000000000001';
        const ACTION = 'NOTHING';

        const payload = gameActionPayload(ROOM_ID, ACTION);

        expect(payload).to.deep.equal({
            room_id: ROOM_ID,
            action: ACTION,
        });
    });

    it('should dispatch gameAction emitter', () => {
        const initialState = {
            usr: { roomId: PAYLOAD.room_id },
        };
        const store = mockStore(initialState);

        emitGameAction(store, PAYLOAD.action);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'games:action:run',
                data: PAYLOAD,
            },
        ]);
    });

    it('should dispatch gameAction listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onGameAction(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'games:action:ran',
                fn: 'FUNCTION',
            },
        ]);
    });
});
