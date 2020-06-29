import React from 'react';
import { StyledStartButton } from './StartButton.style';

import { store } from '../../../store/store';

const StartButton = ({ callback }) => {
    const userState = store.getState().usr;

    return (
        <StyledStartButton onClick={() => callback(userState.roomId)}>Start Game</StyledStartButton>
    );
};

export default StartButton;
