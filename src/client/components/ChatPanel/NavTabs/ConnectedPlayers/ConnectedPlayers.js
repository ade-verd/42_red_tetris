import React, { useEffect, useState } from 'react';
import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';

import { store } from '../../../../index';

import css from './ConnectedPlayers.module.css';

const getRoom = (roomId, rooms) => {
    console.log('[connectedPlayer] rooms', rooms);
    if (!rooms) return;

    let currentRoom;
    rooms.some(room => {
        console.log('[connectedPlayer] rooms', room._id, roomId);
        if (room._id === roomId) {
            currentRoom = room;
            return true;
        }
    });
    return currentRoom;
};

const getPlayers = room => {
    console.log();
    if (!room || !room.players_ids) return null;

    const socket = store.dispatch({ action: 'get_socket' });
    console.log('SOOOCKET', socket);

    return room.players_ids.map((playerId, i) => {
        const icon = i ? 'user' : 'user-cog';
        return (
            <div className={css.item}>
                <FontAwesomeIcon className={css.icon} icon={['fas', icon]} />
                <span>{playerId}</span>
            </div>
        );
    });
};

const ConnectedPlayers = ({ roomId }) => {
    fontAwesomeLibrary.add(faUser, faUserCog);

    const rooms = store.getState().rms.rooms;

    const [room, setRoom] = useState();
    const [players, setPlayers] = useState();
    useEffect(() => {
        console.log('[connectedPlayer] render rooms', room);
        setRoom(getRoom(roomId, rooms));
        console.log('[connectedPlayer] render rooms', room);
    }, [roomId, rooms]);

    useEffect(() => {
        console.log('[connectedPlayer] render player', players);
        if (room) setPlayers(getPlayers(room));
        console.log('[connectedPlayer] render player', players);
    }, [room]);

    return <div className={css.container}>{players}</div>;
};

export default ConnectedPlayers;
