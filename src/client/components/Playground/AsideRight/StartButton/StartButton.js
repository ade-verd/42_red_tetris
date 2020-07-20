import React, { useState } from 'react';
import { StyledStartButton } from './StartButton.style';

import { emitGameReset } from '../../../../actions/game/gameReset'

import { store } from '../../../../store/store';

const StartButton = ({ startGame, resetGame }) => {
    const userState = store.getState().usr;
    const [label, setLabel] = useState('Start');

    const start = () => {
        startGame(userState.roomId);
        setLabel('Reset');
    };

    const reset = () => {
        resetGame(store.dispatch, true);
        emitGameReset(store.dispatch);
        setLabel('Start');
    };

    const onClick = label === 'Start' ? start : reset;

    return <StyledStartButton onClick={onClick}>{label}</StyledStartButton>;
};

export default StartButton;
