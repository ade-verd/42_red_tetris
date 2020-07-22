import React from 'react';

import { StyledTitle, StyledDisplay } from './Display.style';

const Display = ({ title, content }) => {
    const gameWon = content === 'GAME WON';
    const gameOver = content === 'GAME OVER';
    return (
        <div>
            <StyledTitle title={title}>{title}</StyledTitle>
            <StyledDisplay gameWon={gameWon} gameOver={gameOver} title={title}>
                {content}
            </StyledDisplay>
        </div>
    );
};

export default Display;
