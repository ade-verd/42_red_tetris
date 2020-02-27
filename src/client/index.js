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
import roomsReducer from './reducers/rooms';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const initialState = {};

const rootReducer = combineReducers({
    alt: alertReducer,
    fld: fieldReducer,
    pce: pieceReducer,
    rms: roomsReducer,
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

// let playerId;
// import { createPlayer } from './actions/createPlayer';
// socket.emit('players:create', createPlayer('Waldo'));
// socket.on('players:created', player => {
//     console.log('players:created', player);
//     playerId = player._id;
// });

// let roomId;
// import { createRoom } from './actions/createRoom';
// setTimeout(() => socket.emit('rooms:create', createRoom('A good name for a room', playerId)), 2000);
// socket.on('rooms:created', room => {
//     console.log('rooms:created', room);
//     roomId = room.room_id;
// });

// // import { joinRoomPayload } from './actions/joinRoom';
// // setTimeout(
// //     () => socket.emit('rooms:join', joinRoomPayload(roomId, '00000000000000000000000d')),
// //     3000,
// // );
// // socket.on('rooms:joined', result => {
// //     console.log('rooms:joined', result);
// // });

// // import { leaveRoomPayload } from './actions/leaveRoom';
// // socket.on('rooms:left', result => {
// //     console.log('rooms:left', result);
// // });
// // setTimeout(() => socket.emit('rooms:leave', leaveRoomPayload(roomId, playerId)), 4000);
// // setTimeout(
// //     () => socket.emit('rooms:leave', leaveRoomPayload(roomId, '00000000000000000000000d')),
// //     5000,
// // );

// // socket.emit('rooms:get_active');
// // socket.on('rooms:got_active', rooms => {
// //     console.log('rooms:got_active', rooms);
// // });

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
