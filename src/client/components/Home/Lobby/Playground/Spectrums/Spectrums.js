import React from 'react';

import Spectrum from './Spectrum/Spectrum';
import { StyledSpectrums } from './Spectrums.style';

import { getRoom } from '../../../../../helpers/getRoom';

const Spectrums = ({ spectrums, user, rooms }) => {
    const currentRoom = getRoom(rooms.rooms, user.roomId);
    if (!currentRoom) return null;

    const isSinglePlayer = currentRoom.players_ids.length <= 1;
    const isSpectrumsDataEmpty = Object.keys(spectrums).length === 0;
    if (isSinglePlayer || isSpectrumsDataEmpty) return null;

    return (
        <StyledSpectrums>
            {currentRoom.players_ids.map(id => (
                <Spectrum key={id} spectrums={spectrums} playerId={id} />
            ))}
        </StyledSpectrums>
    );
};

export default Spectrums;
