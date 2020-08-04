import styled from 'styled-components';

export const StyledMask = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: ${props => (props.isGameOver ? 0.5 : 1)};
    background: #222;
    /* background: rgba(34, 34, 34, ${props => (props.isGameOver ? 0.5 : 1)}); */
`;

export const StyledContent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    color: #fff;
    font-size: 2.5em;
    white-space: nowrap;
`;
