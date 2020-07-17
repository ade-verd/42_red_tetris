import React, { useState } from 'react';
import { StyledStartButton } from './StartButton.style';

import { store } from '../../../../store/store';

const StartButton = ({ callback }) => {
    const userState = store.getState().usr;
    const [label, setLabel] = useState('Start');

    const start = () => {
        callback(userState.roomId);
        setLabel('Reset');
    };

    const reset = () => {
        setLabel('Start');
    };

    const onClick = label === 'Start' ? start : reset;

    return <StyledStartButton onClick={onClick}>{label}</StyledStartButton>;
};

export default StartButton;
