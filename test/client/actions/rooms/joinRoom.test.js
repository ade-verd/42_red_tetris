'use strict';

import { expect } from 'chai';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    joinRoomPayload,
    emitJoinRoom,
    dispatchReduceRoomJoined,
    onRoomJoined,
} from '../../../../src/client/actions/rooms/joinRoom';

describe('client/actions/rooms/joinRoom', () => {
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
            action.fn({
                payload: { room_id: '01' },
                update: { value: { room_name: 'room' } },
            });
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

    it('should get joinRoom payload', () => {
        const payload = joinRoomPayload('01', '02');
        expect(payload).to.deep.equal({
            room_id: '01',
            player_id: '02',
        });
    });

    it('should dispatch joinRoom emitter', () => {
        const initialState = {
            usr: { id: '02' },
        };
        const store = mockStore(initialState);

        emitJoinRoom(store, '01');

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'rooms:join',
                data: joinRoomPayload('01', '02'),
            },
        ]);
    });

    it('should dispatch ROOM_JOINED action', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const PAYLOAD = {
            payload: { room_id: '01' },
            update: { value: { room_name: 'room' } },
            error: 'none',
        };

        dispatchReduceRoomJoined(store.dispatch, PAYLOAD);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'ROOM_JOINED',
                roomId: PAYLOAD.payload.room_id,
                roomName: PAYLOAD.update.value.room_name,
                error: PAYLOAD.error,
            },
        ]);
    });

    it('should dispatch joinRoom listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onRoomJoined(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'ROOM_JOINED',
                roomId: '01',
                roomName: 'room',
                error: undefined,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'rooms:joined',
                fn: 'FUNCTION',
            },
        ]);
    });
});
