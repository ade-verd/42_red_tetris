'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { toast } from 'react-toastify';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import { GAME_ACTIONS } from '../../../../src/constants';
const helper = require('../../../../src/client/helpers/checkCollision');
import {
    incrementLevel,
    setGameOver,
    reactivateDropTime,
    drop,
    movePiece,
    dropPiece,
    rotate,
    rotatePiece,
    hardDrop,
    move,
} from '../../../../src/client/actions/game/piece';

describe('client/actions/game/gameStart', () => {
    const sandbox = sinon.createSandbox();
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
        sandbox.restore();
    });

    it('should dispatch INCREMENT_LEVEL action', () => {
        const initialState = {};
        const store = mockStore(initialState);

        incrementLevel(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'INCREMENT_LEVEL',
            },
        ]);
    });

    it('should dispatch GAMEOVER action', () => {
        const initialState = {};
        const store = mockStore(initialState);

        setGameOver(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'GAMEOVER',
            },
        ]);
    });

    it('should reactivate drop time', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const EVENT = { keyCode: 32 };
        const GAME_STATUS = { level: 1, gameWon: false, gameOver: false, playing: true };

        reactivateDropTime(store.dispatch, EVENT, GAME_STATUS);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_DROPTIME',
                dropTime: 1000 / GAME_STATUS.level,
            },
        ]);
    });

    it('should not reactivate drop time (from gameStatus)', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const EVENT = { keyCode: 32 };
        const GAME_STATUS = { level: 1, gameWon: false, gameOver: false, playing: false };

        reactivateDropTime(store.dispatch, EVENT, GAME_STATUS);

        const actions = store.getActions();
        expect(actions).to.deep.equal([]);
    });

    it('should not reactivate drop time (from keyCode)', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const EVENT = { keyCode: 0 };
        const GAME_STATUS = { level: 1, gameWon: false, gameOver: false, playing: true };

        reactivateDropTime(store.dispatch, EVENT, GAME_STATUS);

        const actions = store.getActions();
        expect(actions).to.deep.equal([]);
    });

    it('should drop', () => {
        const initialState = {
            usr: { roomId: 'defined' },
            pce: { pieces: [], index: 0, tetromino: [] },
        };
        const store = mockStore(initialState);
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').resolves(false);

        drop(store.dispatch);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'game:start',
                data: { room_id: 'defined', pieces: [], index: 0, nextTetromino: [] },
            },
        ]);
    });
});
