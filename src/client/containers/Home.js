import React from 'react'
import { useHistory } from "react-router-dom";

const Home = () => {
	const history = useHistory()

	const onEnterkey = (event) => {
		if (event.key === 'Enter') {
			history.push({
				pathname: '/rooms',
				name: event.target.value
			})
		}
	}

	return (
		<div>
			<label>You name :</label> 
			<input type="text" id="name" onKeyDown={onEnterkey} required />
		</div>
	)
}

export default Home