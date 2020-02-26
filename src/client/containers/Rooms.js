import React from 'react';
import openSocket from 'socket.io-client';

import CreateRoom from '../components/Rooms/CreateRoom';
import DisplayRooms from '../components/Rooms/DisplayRooms';

const socket = openSocket('http://localhost:3004');

let activeRooms;

socket.emit('rooms:get_active');
socket.on('rooms:get_active', payload => {
    console.log('rooms:get_active', payload);
    activeRooms = payload;
});
socket.on('rooms:created', payload => {
    console.log('rooms:created', payload);
});

const Rooms = props => {
    return (
        <div>
            <CreateRoom socket={socket} />
            ROOMS:
            <DisplayRooms activeRooms={activeRooms} />
        </div>
    );
};

export default Rooms;
