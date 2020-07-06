import React, { useState } from 'react';
import { StyledStartButton } from './StartButton.style';

import { store } from '../../../../index';

const StartButton = ({ callback }) => {
    const userState = store.getState().usr;
    const [label, setLabel] = useState('Start');

    const onClick = () => {
        callback(userState.roomId);
        setLabel('Restart');
    };

    return <StyledStartButton onClick={onClick}>{label}</StyledStartButton>;
};

export default StartButton;
