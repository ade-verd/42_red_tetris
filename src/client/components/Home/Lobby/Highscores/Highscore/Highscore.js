import React from 'react';

import { StyledHighscore, StyledName, FirstPlayerIcon, PlayerIcon } from './Highscore.style'

const Highscore = ({ highscore, index }) => {
    return (
        <StyledHighscore>
            {index === 0 ? <FirstPlayerIcon /> : <PlayerIcon />}
            <StyledName>{highscore.name}</StyledName>
            {highscore.score}
        </StyledHighscore>
    );
};

export default React.memo(Highscore);
