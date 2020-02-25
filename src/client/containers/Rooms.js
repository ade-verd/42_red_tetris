import React from 'react';
import openSocket from 'socket.io-client';

import ActiveRooms from '../components/ActiveRooms';

const socket = openSocket('http://localhost:3004');

let activeRooms;

socket.emit('rooms:get_active');
socket.on('rooms:get_active', rooms => {
    activeRooms = rooms;
});

const Rooms = props => {
    return (
        <div>
            ROOMS:
            <ActiveRooms activeRooms={activeRooms} />
        </div>
    );
};

export default Rooms;
