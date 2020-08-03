'use strict';

import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { toast } from 'react-toastify';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import { GAME_ACTIONS } from '../../../../src/constants';
import {
    handleError,
    getGameStartPayload,
    emitGameStart,
    onGameStart,
    startGame,
} from '../../../../src/client/actions/game/gameStart';

describe('client/actions/game/gameStart', () => {
    const sandbox = sinon.createSandbox();
    let PAYLOAD;
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
            action.fn(PAYLOAD);
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
        PAYLOAD = {
            ...getGameStartPayload('01', { pieces: [], index: 1, nextTetromino: [] }),
            error: null,
        };
    });

    it('should handle socket payload error', () => {
        const warningStub = sandbox.stub(toast, 'warning');
        const errorStub = sandbox.stub(toast, 'error');

        handleError('ValidationError: test', 'errorName');
        expect(warningStub.args).to.deep.equal([
            ['Game start payload one field is missing', { autoClose: 5000 }],
        ]);

        handleError('Error: test', 'errorName');
        expect(errorStub.args).to.deep.equal([
            ['Error while starting the game', { autoClose: 6000 }],
        ]);
    });

    it('should get gameStart payload', () => {
        const ROOM_ID = '0000000000000000001';
        const PIECE = { pieces: [], index: 0, tetromino: [] };

        const payload = getGameStartPayload(ROOM_ID, PIECE);

        expect(payload).to.deep.equal({
            room_id: ROOM_ID,
            pieces: PIECE.pieces,
            index: PIECE.index,
            nextTetromino: PIECE.tetromino,
        });
    });

    it('should dispatch gameStart emitter', () => {
        const initialState = {
            usr: { roomId: 'defined' },
            pce: { pieces: [], index: 0, tetromino: [] },
        };
        const store = mockStore(initialState);

        emitGameStart(store);

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

    it('should dispatch gameStart listener', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const elem = {
            current: {
                focus: () => null,
            },
        };

        onGameStart(store.dispatch, elem);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.REDUCE,
                type: 'PLAYING',
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_PIECES',
                pieces: PAYLOAD.pieces,
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_INDEX',
                index: PAYLOAD.index - 1,
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_NEXT_TETROMINO',
                nextTetromino: PAYLOAD.nextTetromino,
            },
            {
                action: ACTIONS.REDUCE,
                type: 'GET_TETROMINO',
            },
            {
                action: ACTIONS.REDUCE,
                type: 'SET_DROPTIME',
                dropTime: 1000,
            },
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'game:started',
                fn: 'FUNCTION',
            },
        ]);
    });

    it('should not dispatch gameStart listener if error', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const elem = {
            current: {
                focus: () => null,
            },
        };
        PAYLOAD = { ...PAYLOAD, error: 'defined' };

        onGameStart(store.dispatch, elem);

        const actions = store.getActions();
        expect(actions).to.deep.equal([
            {
                action: ACTIONS.LISTEN,
                type: 'DEFINED',
                event: 'game:started',
                fn: 'FUNCTION',
            },
        ]);
    });

    it('should dispatch START action', () => {
        const initialState = {
            usr: { roomId: 'defined' },
            pce: { pieces: [], index: 0, tetromino: [] },
        };
        const store = mockStore(initialState);
        const elem = {
            current: {
                focus: () => null,
            },
        };

        startGame(store, elem);
        const actions = store.getActions();
        expect(actions).to.deep.equal([
            { action: ACTIONS.REDUCE, type: 'PLAYING' },
            { action: ACTIONS.REDUCE, type: 'GET_TETROMINO' },
            { action: ACTIONS.REDUCE, type: 'SET_DROPTIME', dropTime: 1000 },
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'game:start',
                data: { room_id: 'defined', pieces: [], index: 0, nextTetromino: [] },
            },
            {
                action: ACTIONS.EMIT,
                type: 'DEFINED',
                event: 'games:action:run',
                data: { room_id: 'defined', action: GAME_ACTIONS.START },
            },
        ]);
    });
});
