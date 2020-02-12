import styled from 'styled-components'

const margin = 0.5
const tetriminoBorder = 4

export const StyledCell = styled.div`
	width: auto;
	flex: 0 0 calc(25vw / 10 - ${
		props => (props.type === 0 ? margin * 2 + 'px' : (tetriminoBorder + margin) * 2 + 'px')
	});
	height: calc(25vw / 10 - ${
		props => (props.type === 0 ? margin * 2 + 'px' : (tetriminoBorder + margin) * 2 + 'px')
	});
	background: rgba(${ props => props.color }, 0.8);
	margin: ${ margin + 'px' };
	border: ${ props => (props.type === 0 ? '0px solid' : tetriminoBorder + 'px solid') };
	border-bottom-color: rgba(${ props => props.color }, 0.1);
	border-right-color: rgba(${ props => props.color }, 1);
	border-top-color: rgba(${ props => props.color }, 1);
	border-left-color: rgba(${ props => props.color }, 0.3);
`

// ${
// 	props => {
// 		if (props.type !== 0) {
// 			const border = '4px'
// 			return (
// 				'box-shadow: inset 0px ' ' 0px 0px rgba(' +  props.color + ');'
// 			)
// 		}
// 	}
// }