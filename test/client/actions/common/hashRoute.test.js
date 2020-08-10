'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import { newDate } from '../../../../src/client/helpers/utils/date';
import { parseHash, handleHashRoute } from '../../../../src/client/actions/common/hashRoute';
import { createPlayerAndRoomPayload } from '../../../../src/client/actions/common/createPlayerAndRoom';

describe('client/actions/common/hashRoute', () => {
    const sandbox = sinon.createSandbox();
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
            action.fn('PAYLOAD');
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
    });

    it('should parseHash', () => {
        const HASH = '#room[player_name]';

        const res = parseHash(HASH);

        expect(res).to.deep.equal({
            room: 'room',
            player: 'player_name',
        });
    });

    it('should handleHashRoute', () => {
        const initialState = {
            usr: { roomId: undefined },
        };
        const store = mockStore(initialState);
        const HASH = '#room[player_name]';

        handleHashRoute(store, HASH);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'players_rooms:create_join',
                data: createPlayerAndRoomPayload({ playerName: 'player_name', roomName: 'room' }),
            },
        ]);
    });

    it('should not handleHashRoute', () => {
        const initialState = {
            usr: { roomId: 'defined' },
        };
        const store = mockStore(initialState);

        handleHashRoute(store, null);

        const actions = store.getActions();
        expect(actions).to.deep.equal([]);
    });

    it('should handleHashRoute', () => {
        const initialState = {
            usr: { roomId: undefined },
        };
        const store = mockStore(initialState);

        handleHashRoute(store, null);

        const actions = store.getActions();
        expect(actions).to.deep.equal([]);
    });
});
