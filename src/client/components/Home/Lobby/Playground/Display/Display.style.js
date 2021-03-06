import styled from 'styled-components';

import { cellSize } from '../FieldWrapper/AsideRight/NextPiece/Cell/Cell.style';

const widthNext = 5 * cellSize + 'vmin'; /* Horizontal I tetrimino = 4 * cellSize vmin */

export const StyledTitle = styled.div`
    display: flex;

    justify-content: center;

    width: ${props => (props.title === 'NEXT' ? widthNext : 'min-content')};
    font-size: 2vmin;
    margin-top: 10px;
    margin-${props => (props.title === 'NEXT' ? 'right' : 'left')}: auto;
    border-radius: ${props => (props.title === 'NEXT' ? '0 15px 15px 0' : '15px 0 0 15px')};
    padding: 0 15px;

    background-color: white;
    color: black;
`;

export const StyledDisplay = styled.div`
    display: flex;

    width: min-content;
    font-size: 2vmin;
    ${props => (props.title === 'NEXT' ? 'margin: auto' : 'margin-left: auto')};
    padding: 10px;

    color: white;
`;
