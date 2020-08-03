'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
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
        const initialState = {};
        const store = mockStore(initialState);
        const GAME_STATUS = { rows: 0, level: 1 };
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').resolves(false);

        drop(store.dispatch, null, null, GAME_STATUS);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_POS',
                pos: { x: 0, y: 1 },
                collided: false,
            },
        ]);
    });

    it('should increment level and drop', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const GAME_STATUS = { rows: 12, level: 1 };
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').resolves(false);

        drop(store.dispatch, null, null, GAME_STATUS);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'INCREMENT_LEVEL',
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_DROPTIME',
                dropTime: 1000 / (GAME_STATUS.level + 1),
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_POS',
                pos: { x: 0, y: 1 },
                collided: false,
            },
        ]);
    });

    it('should collide and not drop', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const GAME_STATUS = { rows: 0, level: 1 };
        const PIECE = { pos: { x: 0, y: 2 } };
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').resolves(true);

        drop(store.dispatch, null, PIECE, GAME_STATUS);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_POS',
                pos: { x: 0, y: 0 },
                collided: true,
            },
        ]);
    });

    it('should game over and not drop', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const GAME_STATUS = { rows: 0, level: 1 };
        const PIECE = { pos: { x: 0, y: 0 } };
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').resolves(true);

        drop(store.dispatch, null, PIECE, GAME_STATUS);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'GAMEOVER',
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_DROPTIME',
                dropTime: null,
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_POS',
                pos: { x: 0, y: 0 },
                collided: true,
            },
        ]);
    });

    it('should move piece', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const DIR = 1;
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').resolves(false);

        movePiece(store.dispatch, null, null, DIR);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_POS',
                pos: { x: DIR, y: 0 },
            },
        ]);
    });

    it('should not move piece', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const DIR = 1;
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').resolves(true);

        movePiece(store.dispatch, null, null, DIR);

        const actions = store.getActions();
        expect(actions).to.deep.equal([]);
    });
});
