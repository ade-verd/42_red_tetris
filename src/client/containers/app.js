import React from 'react'
import { connect } from 'react-redux'

import Grid from '../components/Grid'

const App = ({message}) => {
  return (
		<span>
			<p>
				{ message }
			</p>
			<Grid/>
		</span>
  )
}

const mapStateToProps = (state) => {
  return {
		message: state.message
  }
}
export default connect(mapStateToProps, null)(App)


