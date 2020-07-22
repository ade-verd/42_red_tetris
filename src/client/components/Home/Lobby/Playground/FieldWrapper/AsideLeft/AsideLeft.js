import React from 'react';

import { StyledAsideLeft } from './AsideLeft.style';

import Display from '../../Display/Display';

const AsideLeft = ({ gameStatus }) => {
    const { score, rows, level } = gameStatus;

    return (
        <StyledAsideLeft>
            <Display title="SCORE" content={score} />
            <Display title="ROWS" content={rows} />
            <Display title="LEVEL" content={level} />
        </StyledAsideLeft>
    );
};

export default AsideLeft;
