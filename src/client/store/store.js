import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import io from 'socket.io-client';

import { asyncDispatchMiddleware } from '../middlewares/asyncDispatch';
import { allStatesMiddleware } from '../middlewares/allStates';
import { handleSocket } from '../middlewares/handleSocket';
import reduxLogger from '../middlewares/reduxLogger';
import rootReducer from '../reducers/index';

const initialState = {};
const socket = io();

export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        thunk,
        asyncDispatchMiddleware,
        allStatesMiddleware,
        reduxLogger,
        handleSocket(socket),
    ),
);
