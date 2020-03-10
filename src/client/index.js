import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { handleSocket } from './middleware/handleSocket';
import { storeStateMiddleWare } from './middleware/storeStateMiddleWare';
import { Provider } from 'react-redux';

import rootReducer from './reducers/index';
import App from './App';

import './index.scss';

const initialState = {};

export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, createLogger(), handleSocket()),
);

ReactDom.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('tetris'),
);
