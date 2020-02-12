import React, { useEffect } from 'react'

import { StyledField } from './styles/StyledField'
import Cell from './Cell'

const Field = ({ field }) => {
	if (!field) { return null }
	return (
		<StyledField width={field[0].length} height={field.length}>
			{ field.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />)) }
		</StyledField>
	)
}

export default Field