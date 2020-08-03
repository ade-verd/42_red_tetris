import React from 'react';

import { StyledAsideRight, StyledBottom } from './AsideRight.style';

import Display from '../../Display/Display';
import StartButton from './StartButton/StartButton';
import NextPiece from './NextPiece/NextPiece';

import { store } from '../../../../../../store/store';

const AsideRight = props => {
    const { isAdmin, piece, playgroundRef, startGame, resetGame } = props;
    const _startGame = () => {
        startGame(store, playgroundRef);
    };

    const nextPiece = piece.nextTetromino ? <NextPiece nextPiece={piece.nextTetromino} /> : null;

    return (
        <StyledAsideRight>
            <Display title="NEXT" content={nextPiece} />
            <StyledBottom>
                {isAdmin ? <StartButton startGame={_startGame} resetGame={resetGame} /> : null}
            </StyledBottom>
        </StyledAsideRight>
    );
};

export default AsideRight;
