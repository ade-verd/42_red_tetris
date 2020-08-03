import React, { useState } from 'react';
import { StyledStartButton } from './StartButton.style';

import { store } from '../../../../../../../store/store';

const StartButton = ({ startGame, resetGame }) => {
    const [label, setLabel] = useState('Start');

    const start = () => {
        startGame();
        setLabel('Reset');
    };

    const reset = () => {
        resetGame(store, true);
        setLabel('Start');
    };

    const onClick = () => (label === 'Start' ? start() : reset());

    return <StyledStartButton onClick={onClick}>{label}</StyledStartButton>;
};

export default StartButton;
