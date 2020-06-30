import React from 'react';

import Spectrum from './Spectrum/Spectrum';
import { StyledSpectrums } from './Spectrums.style';

const getRoom = (rooms, roomId) => {
    if (!rooms) return;

    let currentRoom;
    rooms.some(room => {
        if (room._id === roomId) {
            currentRoom = room;
            return true;
        }
    });

    return currentRoom;
};

const Spectrums = ({ spectrums, user, rooms }) => {
    const currentRoom = getRoom(rooms.rooms, user.roomId);
    if (!currentRoom) return null;

    return (
        <StyledSpectrums>
            {currentRoom.players_ids.map(id => (
                <Spectrum key={id} spectrums={spectrums} playerId={id} />
            ))}
        </StyledSpectrums>
    );
};

export default Spectrums;
