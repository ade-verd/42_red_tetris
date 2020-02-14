import React from 'react'

const Rooms = (props) => (
	<div>
		ROOMS<br />
		{ props.location.name }<br />
		{ JSON.stringify(props.location) }
	</div>
)

export default Rooms