import { expect } from 'chai';
import sinon from 'sinon';

import { configureStore, fakeSocket } from '../../helpers/client';
import rootReducer from '../../../src/client/reducers';

import { resetState } from '../../../src/client/actions/game/field.js';
import { updateGameStatus } from '../../../src/client/actions/game/gameStatus.js';
import { incrementLevel, setGameOver } from '../../../src/client/actions/game/piece.js';
import { incrementRowsCleared, setRowsCleared } from '../../../src/client/reducers/field.js';

describe('client/reducers/gameStatus', function() {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sinon.stub(console, 'debug');
    });

    afterEach(() => {
        console.debug.restore();
        sandbox.restore();
    });

    describe('UPDATE_ROWS_SCORE', function() {
        it('should update rows and score', function(done) {
            const initialState = {
                gme: {
                    score: 0,
                    rows: 0,
                    rowsCleared: 1,
                    level: 1,
                    gameOver: false,
                },
            };
            const store = configureStore(rootReducer, null, initialState, {
                UPDATE_ROWS_SCORE: ({ dispatch, getState }) => {
                    const state = getState().gme;
                    expect(state).to.deep.equal({
                        score: 80,
                        rows: 1,
                        rowsCleared: 1,
                        level: 1,
                        gameOver: false,
                    });
                    done();
                },
            });

            updateGameStatus(store.dispatch);
        });

        it('should not update the state if rowCleared is set to 0', function(done) {
            const initialState = {
                gme: {
                    score: 0,
                    rows: 0,
                    rowsCleared: 0,
                    level: 1,
                    gameOver: false,
                },
            };
            const store = configureStore(rootReducer, null, initialState, {
                UPDATE_ROWS_SCORE: ({ dispatch, getState }) => {
                    const state = getState().gme;
                    expect(state).to.deep.equal({
                        score: 0,
                        rows: 0,
                        rowsCleared: 0,
                        level: 1,
                        gameOver: false,
                    });
                    done();
                },
            });

            updateGameStatus(store.dispatch);
        });
    });

    describe('INCREMENT_LEVEL', function() {
        it('should increment level', function(done) {
            const initialState = {
                gme: {
                    score: 0,
                    rows: 0,
                    rowsCleared: 0,
                    level: 1,
                    gameOver: false,
                },
            };
            const store = configureStore(rootReducer, null, initialState, {
                INCREMENT_LEVEL: ({ dispatch, getState }) => {
                    const state = getState().gme;
                    expect(state).to.deep.equal({
                        score: 0,
                        rows: 0,
                        rowsCleared: 0,
                        level: 2,
                        gameOver: false,
                    });
                    done();
                },
            });

            incrementLevel(store.dispatch);
        });
    });

    describe('SET_ROWSCLEARED', function() {
        it('should set rows cleared', function(done) {
            const payload = { rowsCleared: 0 };

            const initialState = {
                gme: {
                    score: 0,
                    rows: 0,
                    rowsCleared: 10,
                    level: 1,
                    gameOver: false,
                },
            };
            const store = configureStore(rootReducer, null, initialState, {
                SET_ROWSCLEARED: ({ dispatch, getState }) => {
                    const state = getState().gme;
                    expect(state).to.deep.equal({
                        score: 0,
                        rows: 0,
                        rowsCleared: 0,
                        level: 1,
                        gameOver: false,
                    });
                    done();
                },
            });

            setRowsCleared(store.dispatch, payload);
        });
    });

    describe('INCREMENT_ROWSCLEARED', function() {
        it('should increment rows cleared', function(done) {
            const initialState = {
                gme: {
                    score: 0,
                    rows: 0,
                    rowsCleared: 0,
                    level: 1,
                    gameOver: false,
                },
            };
            const store = configureStore(rootReducer, null, initialState, {
                INCREMENT_ROWSCLEARED: ({ dispatch, getState }) => {
                    const state = getState().gme;
                    expect(state).to.deep.equal({
                        score: 0,
                        rows: 0,
                        rowsCleared: 1,
                        level: 1,
                        gameOver: false,
                    });
                    done();
                },
            });

            incrementRowsCleared(store.dispatch);
        });
    });

    describe('GAMEOVER', function() {
        it('should set game over', function(done) {
            const initialState = {
                gme: { score: 0, rows: 0, rowsCleared: 0, level: 1, gameOver: false },
            };
            const store = configureStore(rootReducer, null, initialState, {
                GAMEOVER: ({ dispatch, getState }) => {
                    const state = getState().gme;
                    expect(state).to.deep.equal({
                        score: 0,
                        rows: 0,
                        rowsCleared: 0,
                        level: 1,
                        gameOver: true,
                    });
                    done();
                },
            });

            setGameOver(store.dispatch);
        });
    });

    describe('RESET', function() {
        it('should reset the state', function(done) {
            const initialState = {
                gme: { score: 1000, rows: 12, rowsCleared: 13, level: 14, gameOver: true },
            };
            const store = configureStore(rootReducer, null, initialState, {
                RESET: ({ dispatch, getState }) => {
                    const state = getState().gme;
                    expect(state).to.deep.equal({
                        score: 0,
                        rows: 0,
                        rowsCleared: 0,
                        level: 1,
                        gameOver: false,
                        gameWon: false,
                        playing: false,
                    });
                    done();
                },
            });

            resetState(store.dispatch);
        });
    });
});
