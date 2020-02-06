import React from 'react'
import { connect } from 'react-redux'

const App = ({message}) => {
  return (
		<span>
			<p>
				{ message }
			</p>
		</span>
  )
}

const mapStateToProps = (state) => {
  return {
		message: state.message
  }
}
export default connect(mapStateToProps, null)(App)


