import React from 'react';

import { StyledAsideLeft, StyledBottom } from './AsideLeft.style';

import Spectrums from './Spectrums/Spectrums';
import Display from '../Display/Display';

const AsideLeft = props => {
    const { gameStatus, spectrums, user, rooms } = props;
    const { score, rows, level } = gameStatus;

    return (
        <StyledAsideLeft>
            <Spectrums spectrums={spectrums} user={user} rooms={rooms} />
            <StyledBottom>
                <Display title='SCORE' content={score} />
                <Display title='ROWS' content={rows} />
                <Display title='LEVEL' content={level} />
            </StyledBottom>
        </StyledAsideLeft>
    );
};

export default AsideLeft;