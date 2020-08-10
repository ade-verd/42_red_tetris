'use strict';

import { expect } from 'chai';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    createRoomPayload,
    emitCreateRoom,
    dispatchReduceRoomCreated,
    onRoomCreated,
} from '../../../../src/client/actions/rooms/createRoom';

describe('client/actions/rooms/createRoom', () => {
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
            action.fn({ room_id: '01', room_name: 'room' });
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

    it('should get createRoom payload', () => {
        const ROOM_NAME = 'room';
        const ADMIN_ID = '01';

        const payload = createRoomPayload(ROOM_NAME, ADMIN_ID);
        expect(payload).to.deep.equal({
            room_name: ROOM_NAME,
            admin_id: ADMIN_ID,
        });
    });

    it('should dispatch createRoom emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const ROOM_NAME = 'room';
        const ADMIN_ID = '01';

        emitCreateRoom(store.dispatch, ROOM_NAME, ADMIN_ID);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'rooms:create',
                data: createRoomPayload(ROOM_NAME, ADMIN_ID),
            },
        ]);
    });

    it('should dispatch ROOM_CREATED action', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const PAYLOAD = { room_id: '01', room_name: 'room', error: 'none' };

        dispatchReduceRoomCreated(store.dispatch, PAYLOAD);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'ROOM_CREATED',
                roomId: '01',
                roomName: 'room',
                error: 'none',
            },
        ]);
    });

    it('should dispatch player created listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onRoomCreated(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'ROOM_CREATED',
                roomId: '01',
                roomName: 'room',
                error: undefined,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'rooms:created',
                fn: 'FUNCTION',
            },
        ]);
    });
});
