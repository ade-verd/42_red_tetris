import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import CreateRoom from '../components/Rooms/CreateRoom';
import DisplayRooms from '../components/Rooms/DisplayRooms';

import { createRoom } from '../actions/createRoom';

import { ACTIONS } from '../middleware/handleSocket';

const Rooms = ({ rooms, ...dispatchs }) => {
    useEffect(() => {
        console.debug('[Rooms] ONLY FIRST TIME');
        dispatchs.listen();
        dispatchs.emitGetActiveRooms();
    }, []);

    useEffect(() => {
        console.debug('[Rooms] rendering');
    }, [rooms]);

    return (
        <div>
            <CreateRoom createRoom={dispatchs.emitCreateRoom} />
            ROOMS:
            <DisplayRooms activeRooms={rooms} />
        </div>
    );
};

const mapStateToProps = state => {
    console.debug('[Rooms][mapStateToProps] State', state);
    return { rooms: state.rms.rooms };
};

const mapDispatchToProps = dispatch => {
    return {
        listen: () => {
            dispatch({
                action: ACTIONS.LISTEN,
                event: 'rooms:got_active',
                fn: rooms => {
                    dispatch({
                        action: ACTIONS.REDUCE,
                        type: 'UPDATE_ACTIVE_ROOMS',
                        rooms,
                    });
                },
            });
            dispatch({
                action: ACTIONS.LISTEN,
                event: 'rooms:created',
                fn: payload => console.log('rooms:created', payload),
            });
        },
        emitGetActiveRooms: () =>
            dispatch({
                action: ACTIONS.EMIT,
                event: 'rooms:get_active',
            }),

        emitCreateRoom: (roomName, roomCreaterId) =>
            dispatch({
                action: ACTIONS.EMIT,
                event: 'rooms:create',
                data: createRoom(roomName, roomCreaterId),
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
