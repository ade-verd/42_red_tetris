import React from 'react';

import AsideLeft from './AsideLeft/AsideLeft';
import AsideRight from './AsideRight/AsideRight';
import Field from './Field/Field';

import { StyledFieldWrapper } from './FieldWrapper.style';

const FieldWrapper = ({ field, gameStatus, isAdmin, piece, user, playgroundRef, ...dispatchs }) => {
    return (
        <StyledFieldWrapper>
            <AsideLeft gameStatus={gameStatus} />
            <Field field={field} />
            <AsideRight
                gameWon={gameStatus.gameWon}
                gameOver={gameStatus.gameOver}
                isAdmin={isAdmin}
                user={user}
                piece={piece}
                playgroundRef={playgroundRef}
                startGame={dispatchs.startGame}
                resetGame={dispatchs.resetGame}
            />
        </StyledFieldWrapper>
    );
};

export default FieldWrapper;
