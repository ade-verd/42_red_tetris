import styled from 'styled-components';

export const StyledField = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    border: 5px solid #fff;
    border-radius: 5px;

    background: #222;
    opacity: ${props => (props.gameOver ? 0.5 : 1)};
`;

export const Row = styled.div`
    display: flex;
    flex: 0 0;
    flex-wrap: nowrap;
`;
