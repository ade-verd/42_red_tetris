import React from 'react';

import { StyledTitle, StyledDisplay } from './Display.style';

const Display = ({ title, content }) => {
    return (
        <div>
            <StyledTitle title={title}>{title}</StyledTitle>
            <StyledDisplay gameOver={content === 'GAME OVER'} title={title}>
                {content}
            </StyledDisplay>
        </div>
    );
};

export default Display;
