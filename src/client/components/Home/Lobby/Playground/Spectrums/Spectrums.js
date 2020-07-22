import React from 'react';

import Spectrum from './Spectrum/Spectrum';
import { StyledSpectrums } from './Spectrums.style';

import { getRoom } from '../../../../../helpers/getRoom';

const Spectrums = ({ players, rooms, spectrums, user }) => {
    const currentRoom = getRoom(rooms.rooms, user.roomId);
    if (!currentRoom) return null;

    const isSinglePlayer = currentRoom.players_ids.length <= 1;
    if (isSinglePlayer) return null;

    return (
        <StyledSpectrums>
            {currentRoom.players_ids.map(playerId =>
                playerId !== user.id ? (
                    <Spectrum
                        key={playerId}
                        players={players}
                        playerId={playerId}
                        spectrums={spectrums}
                    />
                ) : null,
            )}
        </StyledSpectrums>
    );
};

export default Spectrums;
