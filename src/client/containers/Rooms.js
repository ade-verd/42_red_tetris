import React from 'react';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';

import CreateRoom from '../components/Rooms/CreateRoom';
import DisplayRooms from '../components/Rooms/DisplayRooms';

const socket = openSocket('http://localhost:3004');

let activeRooms;

socket.emit('rooms:get_active');
socket.on('rooms:got_active', payload => {
    console.log('rooms:got_active', payload);
    activeRooms = payload;
});
socket.on('rooms:created', payload => {
    console.log('rooms:created', payload);
});

const Rooms = ({ activeRooms: rooms, ...dispatchs }) => {
    dispatchs.onStart();

    return (
        <div>
            <CreateRoom socket={socket} />
            ROOMS:
            <DisplayRooms activeRooms={activeRooms} />
        </div>
    );
};

const mapStateToProps = state => {
    console.debug('[Rooms][mapStateToProps] State', state);
    return { rooms: state.rms.rooms };
};

const mapDispatchToProps = dispatch => {
    return {
        // onAlert: () => dispatch(alert('Soon, will be here a fantastic te-Tetris ...')),
        onStart: () => {
            dispatch({
                event: 'server/start',
                handle: () => {
                    dispatch(alert('Soon, will be here a fantastic te-Tetris ...'));
                    dispatch({
                        emit: true,
                        event: 'tetriminos:get_random',
                        data: getTetriminos('5e5790717e915983669fa4b8', 1, 20),
                    });
                    dispatch({
                        event: 'tetriminos:get_random',
                        handle: ({ pieces }) => {
                            dispatch({ type: 'start', piece: pieces[0].shape });
                        },
                    });
                },
            });
        },
        fieldUpdate: piece => dispatch({ type: 'update', piece: piece }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
