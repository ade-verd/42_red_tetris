'use strict';

import { expect } from 'chai';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import { emitGetPlayers } from '../../../../src/client/actions/players/getPlayers';
import {
    getRoomPlayersPayload,
    emitGetRoomPlayers,
    dispatchReduceUpdateActiveRooms,
    onGotRoomPlayers,
} from '../../../../src/client/actions/rooms/getRoomPlayers';

describe('client/actions/rooms/getRoomPlayers', () => {
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
            action.fn({ rooms: [], lobby: [] });
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

    it('should get roomPlayers payload', () => {
        const payload = getRoomPlayersPayload('01');
        expect(payload).to.deep.equal({
            room_id: '01',
        });
    });

    it('should dispatch getRoomPlayers emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);

        emitGetRoomPlayers(store.dispatch, '01');

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'rooms:players:get',
                data: getRoomPlayersPayload('01'),
            },
        ]);
    });

    it('should dispatch UPDATE_ACTIVE_ROOMS action', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const PAYLOAD = { rooms: [], lobby: [], error: 'none' };

        dispatchReduceUpdateActiveRooms(store, PAYLOAD);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'UPDATE_ACTIVE_ROOMS',
                store: store,
                rooms: PAYLOAD.rooms,
                lobby: PAYLOAD.lobby,
                fnUpdatePlayers: emitGetPlayers,
                error: 'none',
            },
        ]);
    });

    it('should dispatch getRoomPlayers listener', () => {
        const initialState = {};
        const store = mockStore(initialState);

        onGotRoomPlayers(store);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'UPDATE_ACTIVE_ROOMS',
                store: store,
                rooms: [],
                lobby: [],
                fnUpdatePlayers: emitGetPlayers,
                error: undefined,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'rooms:got_active',
                fn: 'FUNCTION',
            },
        ]);
    });
});
