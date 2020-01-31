import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import reducer from './reducers'
import App from './containers/app'
import {alert} from './actions/alert'

import { socket } from './socketio'

const initialState = { db: [] }

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
socket.on('db', db => {
	store.dispatch({ type: 'DB', db: db })
});
