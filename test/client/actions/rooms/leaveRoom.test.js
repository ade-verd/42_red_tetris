'use strict';

import { expect } from 'chai';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    leaveRoomPayload,
    dispatchEmitLeaveRoom,
    dispatchReduceLeaveRoom,
    emitLeaveRoom,
    dispatchReduceRoomLeft,
    onRoomLeft,
} from '../../../../src/client/actions/rooms/leaveRoom';

describe('client/actions/rooms/leaveRoom', () => {
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
            action.fn({});
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

    it('should get leaveRoom payload', () => {
        const payload = leaveRoomPayload('01', '02');
        expect(payload).to.deep.equal({
            room_id: '01',
            player_id: '02',
        });
    });

    it('should dispatch leaveRoom emitter', () => {
        const initialState = {
            usr: { id: '02', roomId: '01' },
        };
        const store = mockStore(initialState);

        dispatchEmitLeaveRoom(store);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'rooms:leave',
                data: leaveRoomPayload('01', '02'),
            },
        ]);
    });

    it('should dispatch LEAVE_ROOM action', () => {
        const initialState = {};
        const store = mockStore(initialState);

        dispatchReduceLeaveRoom(store);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'LEAVE_ROOM',
                roomId: null,
                roomName: null,
            },
        ]);
    });

    it('should dispatch leaveRoom', () => {
        const initialState = {
            usr: { id: '02', roomId: '01' },
        };
        const store = mockStore(initialState);

        emitLeaveRoom(store);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'rooms:leave',
                data: leaveRoomPayload('01', '02'),
            },
            {
                action: ACTIONS.REDUCE,
                type: 'LEAVE_ROOM',
                roomId: null,
                roomName: null,
            },
        ]);
    });

    it('should dispatch ROOM_LEFT action', () => {
        const initialState = {};
        const store = mockStore(initialState);

        dispatchReduceRoomLeft(store.dispatch, {});

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'ROOM_LEFT',
                error: undefined,
            },
        ]);
    });

    it('should dispatch leaveRoom listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onRoomLeft(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'ROOM_LEFT',
                error: undefined,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'rooms:left',
                fn: 'FUNCTION',
            },
        ]);
    });
});
