import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { handleSocket } from './middleware/handleSocket';
import { storeStateMiddleWare } from './middleware/storeStateMiddleWare';
import { Provider } from 'react-redux';

import alertReducer from './reducers/alert';
import fieldReducer from './reducers/field';
import pieceReducer from './reducers/piece';
import playerReducer from './reducers/player';
import roomReducer from './reducers/room';
import userReducer from './reducers/user';

import App from './App';

import './index.scss';

const initialState = {};

const rootReducer = combineReducers({
    alt: alertReducer,
    fld: fieldReducer,
    pce: pieceReducer,
    play: playerReducer,
    rms: roomReducer,
    usr: userReducer,
});

console.log('OK8');

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

// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:3004');

// // import { getTetriminos } from './actions/getTetriminos';
// // socket.emit('tetriminos:get_random', getTetriminos(playerId, 0, 1));
// // socket.on('tetriminos:get_random', pieces => {
// //     console.log('tetriminos:get_random', pieces);
// // });

// import { gameActionPayload } from './actions/gameAction';
// import { GAME_ACTIONS } from '../constants';
// setTimeout(() => {
//     socket.emit('games:action:run', gameActionPayload(roomId, GAME_ACTIONS.START));
// }, 5000);
// socket.on('games:action:ran', payload => {
//     console.log('games:action:ran', payload);
// });
