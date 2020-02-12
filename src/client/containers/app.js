import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import openSocket from 'socket.io-client'

import Field from '../components/Field'
<<<<<<< HEAD
import StartButton from '../components/StartButton'

import { alert } from '../actions/alert'
import { ping } from '../actions/server'

const socket = openSocket('http://localhost:3004')

socket.emit('action', ping())

const App = ({message, field, player, ...dispatchs}) => {
	socket.on('server/start', () => {
		dispatchs.onStart()
		dispatchs.onAlert()
	})
	console.log('state2 = ', field, dispatchs)

	useEffect(() => {
		dispatchs.fieldUpdate(player)
	}, [ player ])

	return (
=======

const App = ({message, field}) => {
	console.log('state2 = ', field)
  return (
>>>>>>> b7d2ba4923fb8b314715b70a54ef55dfd01e5cf1
		<span>
			<p>
				{ message }
			</p>
			<Field field={field}/>
<<<<<<< HEAD
			<StartButton callback={dispatchs.onStart} />
		</span>
	)
=======
		</span>
  )
>>>>>>> b7d2ba4923fb8b314715b70a54ef55dfd01e5cf1
}

const mapStateToProps = (state) => {
	console.log('state = ', state)
<<<<<<< HEAD
	return {
		message: state.alt.message,
		field: state.fld.field,
		player: state.ply
	}
=======
  return {
		message: state.alt.message,
		field: state.fld.field
  }
>>>>>>> b7d2ba4923fb8b314715b70a54ef55dfd01e5cf1
}

const mapDispatchToProps = dispatch => {
	return {
		onAlert: () => dispatch(alert('Soon, will be here a fantastic te-Tetris ...')),
		onStart: (player) => dispatch({ type: 'start', payload: player }),
		fieldUpdate: (player) => dispatch({ type: 'update', payload: player })
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
