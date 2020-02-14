import styled from 'styled-components'

const margin = 0.5
const tetriminoBorder = 4
const cellSize = 35 // manually chosen
const tetrominoCalc = cellSize - (tetriminoBorder * 2) + 'px'

export const StyledCell = styled.div`
	height: ${ props => props.type === 0 ? cellSize + 'px' : tetrominoCalc };
	width: ${ props => props.type === 0 ? cellSize + 'px' : tetrominoCalc };
	background: rgba(${ props => props.color }, 0.8);
	margin: ${ margin + 'px' };
	border: ${ props => (props.type === 0 ? '0px solid' : tetriminoBorder + 'px solid') };
	border-bottom-color: rgba(${ props => props.color }, 0.1);
	border-right-color: rgba(${ props => props.color }, 1);
	border-top-color: rgba(${ props => props.color }, 1);
	border-left-color: rgba(${ props => props.color }, 0.3);
`
