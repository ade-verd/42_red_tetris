import { expect } from 'chai';
import sinon from 'sinon';

import reducer, {
    createField,
    updateField,
    incrementRowsCleared,
    setRowsCleared,
} from '../../../src/client/reducers/field';
import { ACTIONS } from '../../../src/client/middlewares/handleSocket';
import * as spectrumActionsLib from '../../../src/client/actions/game/spectrum';

describe('client/reducers/field', function() {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sinon.stub(console, 'debug');
    });

    afterEach(() => {
        console.debug.restore();
        sandbox.restore();
    });

    describe('RESET', function() {
        it('should reset the state', function() {
            const action = { type: 'RESET' };
            const expectedState = createField();

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });

    describe('UPDATE', function() {
        it('should update the state', function() {
            const asyncDispatchStub = sandbox.stub();
            const allStates = {
                pce: {
                    projection: {
                        tetromino: [
                            [0, 'I'],
                            [0, 'I'],
                        ],
                        pos: { x: 0, y: 1 },
                    },
                    tetromino: [
                        [0, 'I'],
                        [0, 'I'],
                    ],
                    collided: false,
                    pos: { x: 0, y: 1 },
                },
                usr: {
                    roomId: '',
                    id: '',
                    name: '',
                },
            };
            const field = [
                [
                    [0, 'clear', false],
                    [0, 'clear', false],
                    [0, 'merged', false],
                ],
                [
                    [0, 'clear', false],
                    [0, 'clear', false],
                    [0, 'clear', false],
                ],
            ];
            const action = {
                type: 'UPDATE',
                asyncDispatch: asyncDispatchStub,
                allStates,
                malus: 1,
            };
            const expectedState = updateField(
                asyncDispatchStub,
                field,
                allStates.pce,
                allStates.usr,
                1,
            );

            expect(reducer({ field }, action)).to.deep.equal(expectedState);
        });

        it('should update the state but piece collided', function() {
            const asyncDispatchStub = sandbox.stub();
            const emitSpectrumStub = sandbox.stub(spectrumActionsLib, 'emitSpectrum');
            const allStates = {
                pce: {
                    projection: {
                        tetromino: [
                            ['I', 'I', 'I'],
                            [0, 'I', 0],
                        ],
                        pos: { x: 0, y: 1 },
                    },
                    tetromino: [
                        ['I', 'I', 'I'],
                        [0, 'I', 0],
                    ],
                    collided: true,
                    pos: { x: 0, y: 1 },
                },
                usr: {
                    roomId: '',
                    id: '',
                    name: '',
                },
            };
            const field = [
                [
                    [0, 'clear', false],
                    [0, 'clear', false],
                    ['I', 'merged', false],
                ],
                [
                    ['I', 'clear', false],
                    ['I', 'clear', false],
                    ['I', 'clear', false],
                ],
            ];
            const action = {
                type: 'UPDATE',
                asyncDispatch: asyncDispatchStub,
                allStates,
                malus: 10,
            };
            const expectedState = updateField(
                asyncDispatchStub,
                field,
                allStates.pce,
                allStates.usr,
                10,
            );

            expect(reducer({ field }, action)).to.deep.equal(expectedState);
            expect(asyncDispatchStub.args[0]).to.deep.equal([
                { action: ACTIONS.REDUCE, type: 'GET_TETROMINO' },
            ]);
            expect(emitSpectrumStub.called).to.deep.equal(true);
        });

        it('should not update', function() {
            const asyncDispatchStub = sandbox.stub();
            const allStates = {
                pce: {
                    projection: {
                        tetromino: [
                            [0, 'I'],
                            [0, 'I'],
                        ],
                        pos: { x: 0, y: 0 },
                    },
                    tetromino: [
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                    ],
                    collided: true,
                    pos: { x: 0, y: 0 },
                },
                usr: {
                    roomId: '',
                    id: '',
                    name: '',
                },
            };
            const field = [
                [
                    [0, 'clear', false],
                    [0, 'clear', false],
                    ['I', 'merged', false],
                ],
                [
                    [0, 'clear', false],
                    [0, 'clear', false],
                    [0, 'clear', false],
                ],
            ];
            const action = {
                type: 'UPDATE',
                asyncDispatch: asyncDispatchStub,
                allStates,
            };
            const expectedState = updateField(
                asyncDispatchStub,
                field,
                allStates.pce,
                allStates.usr,
                undefined,
            );

            expect(reducer({ field }, action)).to.deep.equal(expectedState);
            expect(asyncDispatchStub.args[0]).to.deep.equal([
                { action: ACTIONS.REDUCE, type: 'GAMEOVER' },
            ]);
            expect(asyncDispatchStub.args[1]).to.deep.equal([
                { action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: null },
            ]);
        });
    });

    describe('Dispatchers', function() {
        it('should increment rowsCleared', function() {
            const asyncDispatchStub = sandbox.stub();

            incrementRowsCleared(asyncDispatchStub);

            expect(asyncDispatchStub.args[0]).to.deep.equal([
                { action: ACTIONS.REDUCE, type: 'INCREMENT_ROWSCLEARED' },
            ]);
        });

        it('should set rowsCleared', function() {
            const asyncDispatchStub = sandbox.stub();

            setRowsCleared(asyncDispatchStub, { rowsCleared: 1 });

            expect(asyncDispatchStub.args[0]).to.deep.equal([
                {
                    action: ACTIONS.REDUCE,
                    type: 'SET_ROWSCLEARED',
                    rowsCleared: 1,
                },
            ]);
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
