import React from 'react';

import Room from './Room';
import StyledActiveRooms from './styles/StyledActiveRooms';

const buildRoomsTable = activeRooms => {
    const activeRoomsArray = Object.values(activeRooms);
    return activeRoomsArray.map(room => {
        return (
            <Room
                key={room._id}
                name={room.room_name}
                status={room.game_status}
                playersNumber={room.players_ids.length}
            />
        );
    });
};

const ActiveRooms = props => {
    const roomsTable = buildRoomsTable(props.activeRooms);

    console.log('roomsTable', roomsTable);
    return <StyledActiveRooms>{roomsTable.map(row => row)}</StyledActiveRooms>;
};

export default ActiveRooms;
