import React from 'react';

import {
    StyledEmpty,
    StyledHighscore,
    StyledName,
    FirstPlayerIcon,
    PlayerIcon,
} from './Highscore.style';

const Highscore = ({ highscore, index, none }) => {
    if (!highscore) return <StyledEmpty>No Highscores</StyledEmpty>;
    return (
        <StyledHighscore>
            {index === 0 ? <FirstPlayerIcon /> : <PlayerIcon />}
            <StyledName>{highscore.name}</StyledName>
            {highscore.score}
        </StyledHighscore>
    );
};

export default React.memo(Highscore);
