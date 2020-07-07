import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import io from 'socket.io-client';

import { asyncDispatchMiddleware } from '../middlewares/asyncDispatch';
import { allStatesMiddleware } from '../middlewares/allStates';
import { handleSocket } from '../middlewares/handleSocket';
import rootReducer from '../reducers/index';

import config from '../config';

const initialState = {};
const socket = io(config.server.url);

export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        thunk,
        asyncDispatchMiddleware,
        allStatesMiddleware,
        createLogger(),
        handleSocket(socket),
    ),
);
