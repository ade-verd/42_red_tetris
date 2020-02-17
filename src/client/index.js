import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import reducer from './reducers'
import App from './containers/app'
import { alert } from './actions/alert'

import { createPlayer } from './actions/createPlayer'
import { createRoom } from './actions/createRoom'
import { getTetriminos } from './actions/getTetriminos'
import { ping } from './actions/server'

import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:3004')

const initialState = { }

const store = createStore(
	reducer,
  initialState,
  applyMiddleware(thunk, createLogger())
)

ReactDom.render((
		<Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('tetris'))

store.dispatch(alert('Soon, will be here a fantastic te-Tetris ...'))

socket.emit('action', ping())
socket.on('action', (action) => { console.log(action) })

socket.emit('tetriminos:get_random', getTetriminos('000000000000000000000001', 0, 1));
socket.on('tetriminos:get_random', (pieces) => { console.log(pieces) })

socket.emit('players:create', createPlayer('Waldo'));
socket.on('players:created', (player) => { console.log(player) });

socket.emit('rooms:create', createRoom('A good name for a room', '00000000000000000000000f'));
socket.on('rooms:created', (room) => { console.log(room) });