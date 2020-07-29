import React from 'react';

import {
    StyledEmpty,
    StyledHighscore,
    StyledName,
    StyledScore,
    StyledText,
    FirstPlayerIcon,
    PlayerIcon,
} from './Highscore.style';

const Highscore = ({ highscore, index, none }) => {
    if (!highscore) return <StyledEmpty>No Highscores</StyledEmpty>;
    return (
        <StyledHighscore>
            {index === 0 ? <FirstPlayerIcon /> : <PlayerIcon />}
            <StyledName>{highscore.name}</StyledName>
            <StyledScore>{highscore.score}</StyledScore>
            <StyledText>{' pts'}</StyledText>
        </StyledHighscore>
    );
};

export default React.memo(Highscore);
