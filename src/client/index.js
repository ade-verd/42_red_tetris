import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk';
import { asyncDispatchMiddleware } from './middlewares/asyncDispatch';
import { allStatesMiddleware } from './middlewares/allStates';
import createLogger from 'redux-logger';
import { handleSocket } from './middlewares/handleSocket';

import rootReducer from './reducers/index';
import App from './App';

import './index.scss';

const initialState = {};

export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        thunk,
        asyncDispatchMiddleware,
        allStatesMiddleware,
        createLogger(),
        handleSocket(),
    ),
);

ReactDom.render(
    <Provider store={store}>
        <BrowserRouter>
            <App store={store} />
        </BrowserRouter>
    </Provider>,
    document.getElementById('tetris'),
);
