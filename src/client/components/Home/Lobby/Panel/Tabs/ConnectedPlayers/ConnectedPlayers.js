import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';

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

const getPlayers = (states, isLobby, room) => {
    if (!room || !room.players_ids) return null;

    return room.players_ids.map((playerId, i) => {
        const icon = isLobby || i > 0 ? 'user' : 'user-cog';
        const playerName = get(states, ['players', playerId]);
        if (playerName) {
            return (
                <div key={`connectedPlayer_${playerId}`} className={css.item}>
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
    const players = states.players;

    useEffect(() => {
        if (isLobby) {
            setLobbyUsers(getPlayers(states, isLobby, lobby));
        } else {
            const room = getRoomOrLobby(rooms, roomId);
            setRoomPlayers(getPlayers(states, isLobby, room));
        }
    }, [isLobby, rooms, lobby, players]);

    return <div className={css.container}>{isLobby ? lobbyUsers : roomPlayers}</div>;
};

export default React.memo(ConnectedPlayers);
