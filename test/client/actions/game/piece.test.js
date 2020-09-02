'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
const helper = require('../../../../src/client/helpers/checkCollision');
const pieceLib = require('../../../../src/client/actions/game/piece');
const {
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
} = pieceLib.default;

describe('client/actions/game/piece', () => {
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

    it('should reactivateDropTime', () => {
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

    it('should not reactivateDropTime (from gameStatus)', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const EVENT = { keyCode: 32 };
        const GAME_STATUS = { level: 1, gameWon: false, gameOver: false, playing: false };

        reactivateDropTime(store.dispatch, EVENT, GAME_STATUS);

        const actions = store.getActions();
        expect(actions).to.deep.equal([]);
    });

    it('should not reactivateDropTime (from keyCode)', () => {
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
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').returns(false);

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
        expect(checkCollisionStub.args).to.deep.equal([[null, null, { x: 0, y: 1 }]]);
    });

    it('should increment level and drop', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const GAME_STATUS = { rows: 12, level: 1 };
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').returns(false);

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
        expect(checkCollisionStub.args).to.deep.equal([[null, null, { x: 0, y: 1 }]]);
    });

    it('should collide and not drop', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const GAME_STATUS = { rows: 0, level: 1 };
        const PIECE = { pos: { x: 0, y: 2 } };
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').returns(true);

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
        expect(checkCollisionStub.args).to.deep.equal([[PIECE, null, { x: 0, y: 1 }]]);
    });

    it('should game over and not drop', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const GAME_STATUS = { rows: 0, level: 1 };
        const PIECE = { pos: { x: 0, y: 0 } };
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').returns(true);

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
        expect(checkCollisionStub.args).to.deep.equal([[PIECE, null, { x: 0, y: 1 }]]);
    });

    it('should dropPiece', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const dropStub = sandbox.stub(pieceLib.default, 'drop').returns();

        dropPiece(store.dispatch, null, null, null);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_DROPTIME',
                dropTime: null,
            },
        ]);
        expect(dropStub.args).to.deep.equal([[store.dispatch, null, null, null]]);
    });

    it('should movePiece', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const DIR = 1;
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').returns(false);

        movePiece(store.dispatch, null, null, DIR);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_POS',
                pos: { x: DIR, y: 0 },
            },
        ]);
        expect(checkCollisionStub.args).to.deep.equal([[null, null, { x: DIR, y: 0 }]]);
    });

    it('should not movePiece', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const DIR = 1;
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').returns(true);

        movePiece(store.dispatch, null, null, DIR);

        const actions = store.getActions();
        expect(actions).to.deep.equal([]);
        expect(checkCollisionStub.args).to.deep.equal([[null, null, { x: DIR, y: 0 }]]);
    });

    it('should rotate', () => {
        const MATRIX = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ];
        const EXPECTED_MATRIX_1 = [
            [3, 6, 9],
            [2, 5, 8],
            [1, 4, 7],
        ];
        const EXPECTED_MATRIX_2 = [
            [7, 4, 1],
            [8, 5, 2],
            [9, 6, 3],
        ];

        let res = rotate(MATRIX, 0);
        expect(res).to.deep.equal(EXPECTED_MATRIX_1);

        res = rotate(MATRIX, 1);
        expect(res).to.deep.equal(EXPECTED_MATRIX_2);
    });

    it('should rotatePiece', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const PIECE = { tetromino: [], pos: { x: 0, y: 0 } };
        const DIR = 0;
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').returns(false);
        const rotateStub = sandbox.stub(pieceLib.default, 'rotate').returns([]);

        rotatePiece(store.dispatch, null, PIECE, DIR);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_TETROMINO',
                tetromino: PIECE.tetromino,
                pos: PIECE.pos,
            },
        ]);
        expect(checkCollisionStub.args).to.deep.equal([[PIECE, null, { x: 0, y: 0 }]]);
        expect(rotateStub.args).to.deep.equal([[PIECE.tetromino, DIR]]);
    });

    it('should rotatePiece', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const PIECE = { tetromino: [[]], pos: { x: 0, y: 0 } };
        const DIR = 0;
        const checkCollisionStub = sandbox.stub(helper, 'checkCollision').returns(true);
        const rotateStub = sandbox.stub(pieceLib.default, 'rotate').returns([[]]);

        rotatePiece(store.dispatch, null, PIECE, DIR);

        const actions = store.getActions();
        expect(actions).to.deep.equal([]);
        expect(checkCollisionStub.args).to.deep.equal([
            [PIECE, null, { x: 0, y: 0 }],
            [PIECE, null, { x: 0, y: 0 }],
        ]);
        expect(rotateStub.args).to.deep.equal([
            [PIECE.tetromino, DIR],
            [PIECE.tetromino, -DIR],
        ]);
    });

    it('should hardDrop', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const PIECE = { projection: { pos: { y: 0 } }, pos: { y: 0 } };
        const NEW_POS = { x: 0, y: PIECE.projection.pos.y - PIECE.pos.y };

        hardDrop(store.dispatch, PIECE);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'SET_DROPTIME',
                dropTime: null,
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_POS',
                pos: NEW_POS,
                collided: true,
                hardDrop: true,
            },
        ]);
    });

    it('should move', () => {
        const GAME_STATUS = { gameWon: false, gameOver: false, playing: true };
        const EVENT = { preventDefault: () => {}, keyCode: 37 };
        const movePieceStub = sandbox.stub(pieceLib.default, 'movePiece').returns();
        const dropPieceStub = sandbox.stub(pieceLib.default, 'dropPiece').returns();
        const rotatePieceStub = sandbox.stub(pieceLib.default, 'rotatePiece').returns();
        const hardDropStub = sandbox.stub(pieceLib.default, 'hardDrop').returns();

        move(null, EVENT, null, null, GAME_STATUS);
        expect(movePieceStub.args).to.deep.equal([[null, null, null, -1]]);

        EVENT.keyCode = 39;
        move(null, EVENT, null, null, GAME_STATUS);
        expect(movePieceStub.args).to.deep.equal([
            [null, null, null, -1],
            [null, null, null, 1],
        ]);

        EVENT.keyCode = 40;
        move(null, EVENT, null, null, GAME_STATUS);
        expect(dropPieceStub.args).to.deep.equal([[null, null, null, GAME_STATUS]]);

        EVENT.keyCode = 38;
        move(null, EVENT, null, null, GAME_STATUS);
        expect(rotatePieceStub.args).to.deep.equal([[null, null, null, 1]]);

        EVENT.keyCode = 32;
        move(null, EVENT, null, null, GAME_STATUS);
        expect(hardDropStub.args).to.deep.equal([[null, null]]);
    });

    it('should not move', () => {
        const GAME_STATUS = { gameWon: false, gameOver: false, playing: false };
        const EVENT = { preventDefault: () => {}, keyCode: 0 };

        let res = move(null, EVENT, null, null, GAME_STATUS);
        expect(res).to.deep.equal(undefined);

        GAME_STATUS.playing = true;
        res = move(null, EVENT, null, null, GAME_STATUS);
        expect(res).to.deep.equal(undefined);
    });
});
