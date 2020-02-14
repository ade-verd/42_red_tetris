import styled from 'styled-components'

import bgImage from '../../img/bg.png'

export const StyledPlaygroundWrapper = styled.div`
	width: 100vw;
	height: 100vh;
	background: url(${ bgImage }) #000;
	background-size: cover;
	overflow: hidden;
`

export const StyledPlayground = styled.div`
	display: flex;
	align-items: flex-start;
	padding: 40px;
	margin: 0 auto;

	aside {
		width: 100%;
		max-width: 200px;
		display: block;
		padding 0 20px;
	}
`