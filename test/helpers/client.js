import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { allStatesMiddleware } from '../../src/client/middleware/allStates';
import { asyncDispatchMiddleware } from '../../src/client/middleware/asyncDispatch';
import { handleSocket } from '../../src/client/middleware/handleSocket';

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
