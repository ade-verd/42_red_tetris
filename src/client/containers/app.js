import React from 'react'
import { connect } from 'react-redux'

const App = ({message, db}) => {
	console.log('onur', message, db)
  return (
		<span>
			<p>
				{ message }
			</p>
			<p>
				{ db }
			</p>
		</span>
  )
}

const mapStateToProps = (state) => {
  return {
		message: state.message,
		db: state.db
  }
}
export default connect(mapStateToProps, null)(App)


