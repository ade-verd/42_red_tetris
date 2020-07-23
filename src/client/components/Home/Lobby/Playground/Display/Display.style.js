import styled from 'styled-components';

import { cellSize } from '../FieldWrapper/AsideRight/NextPiece/Cell/Cell.style';

export const StyledContainer = styled.div`
    flex: 1;
`;

const widthNext = 5 * cellSize + 'vmin'; /* Horizontal I tetrimino = 4 * cellSize vmin */

export const StyledTitle = styled.div`
    display: flex;

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
    ${props =>
        props.title === 'NEXT' || props.gameWon || props.gameOver
            ? 'margin: auto'
            : 'margin-left: auto'};
    padding: 10px;
    ${props => (props.gameWon || props.gameOver ? 'padding-bottom: 20px' : '')};

    color: ${props => {
        if (props.gameWon) return '#8bc34a';
        if (props.gameOver) return '#e6443a';
        return 'white';
    }};
`;
