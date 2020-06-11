import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';

import { store } from '../../../../index';

import css from './ConnectedPlayers.module.css';

const getRoomOrLobby = (roomsState, roomId) => {
    if (!roomsState) return;

    let currentRoom;
    roomsState.some(room => {
        if (room._id === roomId) {
            currentRoom = room;
            return true;
        }
    });
    return currentRoom;
};

const getPlayers = (isLobby, room) => {
    if (!room || !room.players_ids) return null;

    const playersState = store.getState().play;

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

const ConnectedPlayers = ({ isLobby, states }) => {
    fontAwesomeLibrary.add(faUser, faUserCog);

    const [lobbyUsers, setLobbyUsers] = useState();
    const [roomPlayers, setRoomPlayers] = useState();

    const roomId = states.user.roomId;
    const lobby = states.rooms.lobby;
    const rooms = states.rooms.rooms;

    if (isLobby) {
        useEffect(() => {
            setLobbyUsers(getPlayers(isLobby, lobby));
            console.log('[ConnectedPlayers] rendering lobby panel');
        }, [lobby]);
    } else {
        useEffect(() => {
            const room = getRoomOrLobby(rooms, roomId);
            setRoomPlayers(getPlayers(isLobby, room));
            console.log('[ConnectedPlayers] rendering room panel');
        }, [roomId, rooms]);
    }

    return <div className={css.container}>{isLobby ? lobbyUsers : roomPlayers}</div>;
};

export default ConnectedPlayers;
