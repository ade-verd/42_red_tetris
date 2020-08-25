import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import io from 'socket.io-client';

import '../middlewares/logger';
import { asyncDispatchMiddleware } from '../middlewares/asyncDispatch';
import { allStatesMiddleware } from '../middlewares/allStates';
import { handleSocket } from '../middlewares/handleSocket';
import reduxLogger from '../middlewares/reduxLogger';
import rootReducer from '../reducers/index';

import config from '../config';

const initialState = {};
const socket = io(config.server.url);

const middlewares = [thunk, asyncDispatchMiddleware, allStatesMiddleware, handleSocket(socket)];

console.log({
    isReduxLoggerEnabled: config.logger.isReduxLoggerEnabled,
    IS_REDUXLOGGER_ENABLED: process.env.IS_REDUXLOGGER_ENABLED,
});
if (process.env.NODE_ENV === `development` || config.logger.isReduxLoggerEnabled) {
    middlewares.push(reduxLogger);
}

export const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares));
