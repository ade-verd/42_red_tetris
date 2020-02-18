import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import alertReducer from './reducers/alert';
import fieldReducer from './reducers/field';
import playerReducer from './reducers/player';
import App from './App';

const initialState = {};

console.log('OK7');

const rootReducer = combineReducers({
    alt: alertReducer,
    fld: fieldReducer,
    ply: playerReducer,
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

store.dispatch(alert('Soon, will be here a fantastic te-Tetris ...'));

socket.emit('action', ping());
socket.on('action', action => {
    console.log(action);
});

socket.emit('tetriminos:get_random', getTetriminos('000000000000000000000001', 0, 1));
socket.on('tetriminos:get_random', pieces => {
    console.log(pieces);
});

socket.emit('players:create', createPlayer('Waldo'));
socket.on('players:created', player => {
    console.log(player);
});

socket.emit('rooms:create', createRoom('A good name for a room', '00000000000000000000000f'));
socket.on('rooms:created', room => {
    console.log(room);
});
