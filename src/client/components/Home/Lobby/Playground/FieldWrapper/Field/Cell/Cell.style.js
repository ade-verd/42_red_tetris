import styled from 'styled-components';

const margin = 0.5;
const tetriminoBorder = 4;
const projectionBorder = 1;
const cellSize = 4; // manually chosen

export const StyledCell = styled.div`
    flex: 1 1 auto;
    height: ${cellSize + 'vmin'};
    width: ${cellSize + 'vmin'};
    margin: ${margin + 'px'};
    border: ${props =>
        props.type === 0
            ? '0px solid'
            : (props.projection ? projectionBorder : tetriminoBorder) + 'px solid'};
    border-bottom-color: rgba(
        ${props => props.color},
        ${props => (props.projection ? '1' : '0.1')}
    );
    border-right-color: rgba(${props => props.color}, 1);
    border-top-color: rgba(${props => props.color}, 1);
    border-left-color: rgba(${props => props.color}, ${props => (props.projection ? '1' : '0.3')});
    background: rgba(${props => (props.projection ? '0, 0, 0' : props.color)}, 0.8);
`;
