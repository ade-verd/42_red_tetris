import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, combineReducers ,applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { storeStateMiddleWare } from './middleware/storeStateMiddleWare'

import alertReducer from './reducers/alert'
import fieldReducer from './reducers/field'
import playerReducer from './reducers/player'
import App from './containers/app'

const initialState = { }

const rootReducer = combineReducers({
	alt: alertReducer,
	fld: fieldReducer,
	ply: playerReducer
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
