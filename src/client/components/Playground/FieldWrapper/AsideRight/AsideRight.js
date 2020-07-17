import React from 'react';

import { StyledAsideRight, StyledBottom } from './AsideRight.style';

import Display from '../../Display/Display';
import StartButton from './StartButton/StartButton';
import NextPiece from './NextPiece/NextPiece';

import { store } from '../../../../store/store';

const AsideRight = props => {
    const { gameOver, isAdmin, user, piece, playgroundRef, startGame, resetGame } = props;
    const callback = () => {
        startGame(store.dispatch, user.roomId, piece.pieces, piece.index, playgroundRef);
    };

    const nextPiece = piece.nextTetromino ? <NextPiece nextPiece={piece.nextTetromino} /> : null;

    return (
        <StyledAsideRight>
            <Display title="NEXT" content={nextPiece} />
            <StyledBottom>
                {gameOver ? <Display content="GAME OVER" /> : null}
                {isAdmin ? <StartButton startGame={callback} resetGame={resetGame} /> : null}
            </StyledBottom>
        </StyledAsideRight>
    );
};

export default AsideRight;
