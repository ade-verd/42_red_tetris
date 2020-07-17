import styled from 'styled-components';

const cellSize = 1.3; // manually chosen

export const StyledCell = styled.div`
    flex: 1 1 auto;
    height: ${cellSize + 'vh'};
    width: ${cellSize + 'vh'};
    background: rgba(${props => props.color}, 0.8);
`;
