import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';

import { store } from '../../../../index';

import css from './ConnectedPlayers.module.css';

const getRoom = (roomId, rooms) => {
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

const getPlayers = room => {
    if (!room || !room.players_ids) return null;

    const playersState = store.getState().play;

    console.log('[connectedPlayers] players', room.players_ids);
    return room.players_ids.map((playerId, i) => {
        const icon = i > 0 ? 'user' : 'user-cog';
        const playerName = _.get(playersState, ['players', playerId]);
        if (playerName) {
            return (
                <div className={css.item}>
                    <FontAwesomeIcon className={css.icon} icon={['fas', icon]} />
                    <span className={css.name}>{playerName}</span>
                </div>
            );
        }
    });
};

const ConnectedPlayers = ({ roomId }) => {
    fontAwesomeLibrary.add(faUser, faUserCog);

    const rooms = store.getState().rms.rooms;

    const [room, setRoom] = useState();
    const [players, setPlayers] = useState();
    useEffect(() => {
        setRoom(getRoom(roomId, rooms));
        console.log('[connectedPlayers] render rooms', room);
    }, [roomId, rooms]);

    useEffect(() => {
        setPlayers(getPlayers(room));
        console.log('[connectedPlayers] render player', players);
    }, [room]);

    return <div className={css.container}>{players}</div>;
};

export default ConnectedPlayers;
