import { expect } from 'chai';
import sinon from 'sinon';

import reducer from '../../../src/client/reducers/piece';
import { FIELD_WIDTH } from '../../../src/constants';
import { ACTIONS } from '../../../src/client/middlewares/handleSocket';
import * as tetriminosActionsLib from '../../../src/client/actions/game/getTetriminos';

describe('client/reducers/piece', function() {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sinon.stub(console, 'debug');
    });

    afterEach(() => {
        console.debug.restore();
        sandbox.restore();
    });

    describe('RESET', function() {
        it('should reset the state if admin', function() {
            const action = { type: 'RESET', isAdmin: true };
            const expectedState = {
                pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
                collided: false,
                dropTime: null,
                amount: 20,
                projection: null,
            };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });

        it('should reset the state if not admin', function() {
            const action = { type: 'RESET' };
            const expectedState = {
                pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
                collided: false,
                tetromino: null,
                nextTetromino: null,
                dropTime: null,
                pieces: null,
                index: 0,
                amount: 20,
                projection: null,
            };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });

    describe('SET_PIECES', function() {
        it('should set the pieces', function() {
            const action = { type: 'SET_PIECES', pieces: [] };
            const expectedState = { pieces: [] };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });

    describe('SET_INDEX', function() {
        it('should set the index', function() {
            const action = { type: 'SET_INDEX', index: 0 };
            const expectedState = { index: 0 };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });

    describe('SET_POS', function() {
        it('should set the pos', function() {
            const action = { type: 'SET_POS', pos: { x: 0, y: 1 }, collided: false };
            const expectedState = { pos: { x: 0, y: 1 }, collided: false };
            const state = { pos: { x: 0, y: 0 } };

            expect(reducer(state, action)).to.deep.equal(expectedState);
        });

        it('should set the pos with negativ Y', function() {
            const asyncDispatchStub = sandbox.stub();
            const action = {
                type: 'SET_POS',
                asyncDispatch: asyncDispatchStub,
                pos: { x: 0, y: -10 },
                collided: false,
            };
            const expectedState = { pos: { x: 0, y: 0 }, collided: false };
            const state = { pos: { x: 0, y: 5 } };

            expect(reducer(state, action)).to.deep.equal(expectedState);
            expect(asyncDispatchStub.args).to.deep.equal([
                [{ action: ACTIONS.REDUCE, type: 'UPDATE_PROJECTION' }],
            ]);
        });
    });

    describe('SET_DROPTIME', function() {
        it('should set the droptime', function() {
            const action = { type: 'SET_DROPTIME', dropTime: 0 };
            const expectedState = { dropTime: 0 };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });

    describe('SET_TETROMINO', function() {
        it('should set the tetromino', function() {
            const asyncDispatchStub = sandbox.stub();
            const action = {
                type: 'SET_TETROMINO',
                asyncDispatch: asyncDispatchStub,
                tetromino: [],
                pos: {},
            };
            const expectedState = { tetromino: [], pos: {} };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
            expect(asyncDispatchStub.args).to.deep.equal([
                [{ action: ACTIONS.REDUCE, type: 'UPDATE_PROJECTION' }],
            ]);
        });
    });

    describe('GET_TETROMINO', function() {
        it('should not get the tetromino', function() {
            const allStates = {
                usr: {},
                gme: { gameWon: true, gameOver: false },
            };
            const action = { type: 'GET_TETROMINO', allStates };
            const expectedState = {};

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });

        it('should get the tetromino with no nextTetromino', function() {
            const asyncDispatchStub = sandbox.stub();
            const allStates = {
                usr: {},
                gme: {},
            };
            const action = { type: 'GET_TETROMINO', asyncDispatch: asyncDispatchStub, allStates };
            const expectedState = {
                pieces: [{ shape: [] }, { shape: [] }],
                tetromino: [],
                nextTetromino: [],
                index: 1,
            };
            const state = {
                pieces: [{ shape: [] }, { shape: [] }],
                index: 0,
            };

            expect(reducer(state, action)).to.deep.equal(expectedState);
            expect(asyncDispatchStub.args).to.deep.equal([
                [{ action: ACTIONS.REDUCE, type: 'UPDATE_PROJECTION' }],
            ]);
        });

        it('should get the tetromino with nextTetromino', function() {
            const asyncDispatchStub = sandbox.stub();
            const allStates = {
                usr: {},
                gme: {},
            };
            const action = { type: 'GET_TETROMINO', asyncDispatch: asyncDispatchStub, allStates };
            const expectedState = {
                pieces: [{ shape: [] }, { shape: [] }],
                tetromino: [],
                nextTetromino: [],
                pos: { x: FIELD_WIDTH / 2 - 2, y: 0 },
                collided: false,
                index: 1,
                amount: 10,
            };
            const state = {
                pieces: [{ shape: [] }, { shape: [] }],
                nextTetromino: [],
                index: 0,
                amount: 10,
            };

            expect(reducer(state, action)).to.deep.equal(expectedState);
            expect(asyncDispatchStub.args).to.deep.equal([
                [{ action: ACTIONS.REDUCE, type: 'UPDATE_PROJECTION' }],
            ]);
        });

        it('should get the tetromino and emit', function() {
            const emitGetRandomTetrmininosStub = sandbox.stub(
                tetriminosActionsLib,
                'emitGetRandomTetriminos',
            );
            const asyncDispatchStub = sandbox.stub();
            const allStates = {
                usr: {},
                gme: {},
            };
            const action = { type: 'GET_TETROMINO', asyncDispatch: asyncDispatchStub, allStates };
            const expectedState = {
                pieces: [{ shape: [] }, { shape: [] }],
                tetromino: [],
                nextTetromino: [],
                index: 9,
                amount: 10,
            };
            const state = {
                pieces: [{ shape: [] }, { shape: [] }],
                index: 8,
                amount: 10,
            };

            expect(reducer(state, action)).to.deep.equal(expectedState);
            expect(asyncDispatchStub.args).to.deep.equal([
                [{ action: ACTIONS.REDUCE, type: 'UPDATE_PROJECTION' }],
            ]);
            expect(emitGetRandomTetrmininosStub.callCount).to.deep.equal(1);
        });
    });

    describe('SET_NEXT_TETROMINO', function() {
        it('should set the nextTetromino', function() {
            const action = { type: 'SET_NEXT_TETROMINO', nextTetromino: [] };
            const expectedState = { nextTetromino: [] };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });

    describe('UPDATE_PROJECTION', function() {
        it('should update the projection', function() {
            const allStates = {
                fld: {
                    field: [
                        [
                            [0, 'clear', false],
                            [0, 'clear', false],
                            [0, 'clear', false],
                        ],
                        [
                            [0, 'clear', false],
                            [0, 'clear', false],
                            [0, 'clear', false],
                        ],
                    ],
                },
            };
            const action = { type: 'UPDATE_PROJECTION', allStates };
            const expectedState = {
                tetromino: [
                    [0, 'I'],
                    [0, 'I'],
                ],
                pos: { x: 0, y: 0 },
                projection: {
                    tetromino: [
                        [0, 'I'],
                        [0, 'I'],
                    ],
                    pos: { x: 0, y: 0 },
                },
            };
            const state = {
                tetromino: [
                    [0, 'I'],
                    [0, 'I'],
                ],
                pos: { x: 0, y: 0 },
            };

            expect(reducer(state, action)).to.deep.equal(expectedState);
        });
    });

    describe('default', function() {
        it('should not touch the state', function() {
            const action = { type: 'none' };
            const expectedState = {};

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });
});
