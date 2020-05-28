import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';

import { store } from '../../../../index';
import { emitGetActiveRooms } from '../../../../actions/rooms/getActiveRooms';

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
    const isLobby = !room._id;

    console.log('[connectedPlayers] players', room.players_ids);
    return room.players_ids.map((playerId, i) => {
        const icon = isLobby || i > 0 ? 'user' : 'user-cog';
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

const ConnectedPlayers = ({ isLobby, roomId }) => {
    fontAwesomeLibrary.add(faUser, faUserCog);

    const rooms = store.getState().rms.rooms;
    const lobby = store.getState().rms.lobby;

    const [room, setRoom] = useState();
    const [players, setPlayers] = useState();

    useEffect(() => {
        setRoom(isLobby ? lobby : getRoom(roomId, rooms));
    }, []);

    useEffect(() => {
        // emitGetActiveRooms(store.dispatch);
        setPlayers(getPlayers(room));
    }, [room, rooms, lobby]);

    return <div className={css.container}>{players}</div>;
};

export default ConnectedPlayers;
