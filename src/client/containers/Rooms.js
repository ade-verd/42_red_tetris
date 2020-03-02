import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import CreateRoom from '../components/Rooms/CreateRoom';
import DisplayRooms from '../components/Rooms/DisplayRooms';

import { createRoom as createRoomPayload } from '../actions/createRoom';
import { getRoomPlayers as getPlayersPayload } from '../actions/getRoomPlayers';

import { ACTIONS } from '../middleware/handleSocket';

const Rooms = ({ rooms, players, ...dispatchs }) => {
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
    return { rooms: state.rms.rooms, players: state.play.players };
};

const mapDispatchToProps = dispatch => {
    const emitGetActiveRooms = () =>
        dispatch({
            action: ACTIONS.EMIT,
            event: 'rooms:get_active',
        });

    const emitGetRoomPlayers = roomId =>
        dispatch({
            action: ACTIONS.EMIT,
            event: 'rooms:players:get',
            data: getPlayersPayload(roomId),
        });

    const emitCreateRoom = (roomName, roomCreaterId) =>
        dispatch({
            action: ACTIONS.EMIT,
            event: 'rooms:create',
            data: createRoomPayload(roomName, roomCreaterId),
        });

    return {
        emitGetActiveRooms,
        emitGetRoomPlayers,
        emitCreateRoom,
        listen: () => {
            dispatch({
                action: ACTIONS.LISTEN,
                event: 'rooms:players:got',
                fn: payload => {
                    dispatch({
                        action: ACTIONS.REDUCE,
                        type: 'UPDATE_PLAYERS_NAMES',
                        players: payload.players,
                    });
                },
            });
            dispatch({
                action: ACTIONS.LISTEN,
                event: 'rooms:got_active',
                fn: rooms => {
                    dispatch({
                        action: ACTIONS.REDUCE,
                        type: 'UPDATE_ACTIVE_ROOMS',
                        rooms,
                        fnUpdatePlayers: emitGetRoomPlayers,
                    });
                },
            });
            dispatch({
                action: ACTIONS.LISTEN,
                event: 'rooms:created',
                fn: payload => console.log('rooms:created', payload),
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
