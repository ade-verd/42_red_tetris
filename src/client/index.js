import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, combineReducers ,applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import openSocket from 'socket.io-client'

import alertReducer from './reducers/alert'
import fieldReducer from './reducers/field'
import App from './containers/app'

import { alert } from './actions/alert'
import { ping } from './actions/server'

const socket = openSocket('http://localhost:3004')

const initialState = { }

const rootReducer = combineReducers({
	alt: alertReducer,
	fld: fieldReducer
})

const store = createStore(
	rootReducer,
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
socket.on('action', (action) => {
	store.dispatch({ type: 'start' })
})
