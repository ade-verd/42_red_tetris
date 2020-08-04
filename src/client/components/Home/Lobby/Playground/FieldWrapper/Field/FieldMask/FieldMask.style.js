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
    max-width: inherit;

    color: #fff;
    font-size: ${props => (props.isSpectrum ? '2vmin' : '4vmin')};
    white-space: ${props => (props.isSpectrum ? 'pre-line' : 'nowrap')};
    text-align: center;
`;
