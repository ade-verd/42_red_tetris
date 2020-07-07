import React from 'react';

import { StyledAsideRight, StyledBottom } from './AsideRight.style';

import Display from '../Display/Display';
import StartButton from './StartButton/StartButton';
import NextPiece from './NextPiece/NextPiece';

const AsideRight = props => {
    const { gameOver, isAdmin, dispatch, user, piece, playgroundRef, startGame } = props;
    const callback = () => {
        startGame(dispatch, user.roomId, piece.pieces, piece.index, playgroundRef);
    };

    const nextPiece = piece.nextTetromino ? <NextPiece nextPiece={piece.nextTetromino} /> : null;

    return (
        <StyledAsideRight>
            <Display title="NEXT" content={nextPiece} />
            <StyledBottom>
                {gameOver ? <Display content="GAME OVER" /> : null}
                {isAdmin ? <StartButton callback={callback} /> : null}
            </StyledBottom>
        </StyledAsideRight>
    );
};

export default AsideRight;
