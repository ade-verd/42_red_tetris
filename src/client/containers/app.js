import React from 'react'
import { connect } from 'react-redux'

import Field from '../components/Field'

const App = ({message, field}) => {
	console.log('state2 = ', field)
  return (
		<span>
			<p>
				{ message }
			</p>
			<Field field={field}/>
		</span>
  )
}

const mapStateToProps = (state) => {
	console.log('state = ', state)
  return {
		message: state.message,
		field: state.field
  }
}
export default connect(mapStateToProps, null)(App)


