'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import { GAME_ACTIONS } from '../../../../src/constants';
import { updateGameStatus } from '../../../../src/client/actions/game/gameStatus';

describe('client/actions/game/gameStart', () => {
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

    it('should dispatch UPDATE_ROWS_SCORE action', () => {
        const initialState = {};
        const store = mockStore(initialState);

        updateGameStatus(store.dispatch);
        const actions = store.getActions();
        expect(actions).to.deep.equal([{ action: ACTIONS.REDUCE, type: 'UPDATE_ROWS_SCORE' }]);
    });
});
