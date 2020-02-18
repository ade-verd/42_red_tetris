import React from 'react';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3004');

let activeRooms;

socket.emit('rooms:get_active');
socket.on('rooms:get_active', rooms => {
    console.log('rooms', rooms);
    activeRooms = JSON.stringify(rooms);
});

const Rooms = props => {
    return (
        <div>
            ROOMS
            <br />
            {props.location.name}
            <br />
            {JSON.stringify(props.location)}
            <br />
            {activeRooms}
        </div>
    );
};

export default Rooms;
