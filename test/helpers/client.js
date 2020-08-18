import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import sinon from 'sinon';

import { allStatesMiddleware } from '../../src/client/middlewares/allStates';
import { asyncDispatchMiddleware } from '../../src/client/middlewares/asyncDispatch';
import { handleSocket } from '../../src/client/middlewares/handleSocket';

export const configureStore = (reducer, socket, initialState, types) =>
    createStore(
        reducer,
        initialState,
        applyMiddleware(
            allStatesMiddleware,
            asyncDispatchMiddleware,
            handleSocket(socket),
            myMiddleware(types),
            thunk,
        ),
    );

const isFunction = arg => {
    return typeof arg === 'function';
};

const myMiddleware = (types = {}) => {
    const fired = {};
    return store => next => action => {
        const result = next(action);
        const cb = types[action.type];
        if (cb && !fired[action.type]) {
            if (!isFunction(cb)) {
                throw new Error("action's type value must be a function");
            }
            fired[action.type] = true;
            cb({ getState: store.getState, dispatch: store.dispatch, action });
        }
        return result;
    };
};

export const fakeSocket = id => ({
    id: id || '0000001',
    on: sinon.stub(),
    off: () => ({
        on: sinon.stub(),
    }),
    emit: sinon.stub(),
    connect: sinon.stub(),
    removeEventListener: sinon.stub(),
});
