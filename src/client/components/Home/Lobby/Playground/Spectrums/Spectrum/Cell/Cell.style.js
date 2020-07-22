import styled from 'styled-components';

const cellSize = 1.3; // manually chosen

export const StyledCell = styled.div`
    flex: 1 1 auto;
    height: ${cellSize + 'vmin'};
    width: ${cellSize + 'vmin'};
    background: rgba(${props => props.color}, 0.8);
`;
