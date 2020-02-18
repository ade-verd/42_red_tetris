import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import alertReducer from './reducers/alert';
import fieldReducer from './reducers/field';
import pieceReducer from './reducers/piece';
import App from './App';

const initialState = {};

console.log('OK7');

const rootReducer = combineReducers({
    alt: alertReducer,
    fld: fieldReducer,
    pce: pieceReducer,
});

console.log('OK8');

export const store = createStore(rootReducer, initialState, applyMiddleware(thunk, createLogger()));

console.log('OK9');

ReactDom.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('tetris'),
);

console.log('OK10');
