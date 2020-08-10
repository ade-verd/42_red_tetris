'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import {
    createPlayerAndRoomPayload,
    emitCreatePlayerAndRoom,
} from '../../../../src/client/actions/common/createPlayerAndRoom';

describe('client/actions/common/createPlayerAndRoo', () => {
    // To ignore 'Error: Actions may not have an undefined "type" property'
    const addTypePropertyMiddleware = store => next => action => {
        let typedAction = action;

        if (!action.type) typedAction = { ...action, type: 'DEFINED' };

        const res = next(typedAction);

        return res;
    };
    const middlewares = [addTypePropertyMiddleware];

    let mockStore;
    beforeEach(() => {
        mockStore = configureStore(middlewares);
    });

    it('should get createPlayerAndRoom payload', () => {
        const DATA = { playerName: 'name', roomName: 'room' };

        const payload = createPlayerAndRoomPayload(DATA);

        expect(payload).to.deep.equal({
            player_name: DATA.playerName,
            room_name: DATA.roomName,
        });
    });

    it('should dispatch createPlayerAndRoom emitter', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const DATA = { playerName: 'name', roomName: 'room' };

        emitCreatePlayerAndRoom(store.dispatch, DATA.playerName, DATA.roomName);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'players_rooms:create_join',
                data: createPlayerAndRoomPayload(DATA),
            },
        ]);
    });
});
