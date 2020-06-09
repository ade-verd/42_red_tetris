import React, { useEffect, useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';

import { store } from '../../../index';

import ConnectedPlayers from './ConnectedPlayers/ConnectedPlayers';
import ChatWindow from './ChatWindow/ChatWindow';

import css from './Channels.module.css';

const lobbyTab = states => {
    const lobby = states.rooms.lobby;
    return (
        <div eventKey="lobby" title="Lobby">
            <ConnectedPlayers isLobby={true} roomId={null} lobby={lobby} />
            <ChatWindow isLobby={true} states={states} />
        </div>
    );
};

const roomTab = states => {
    const userState = states.user;
    const rooms = states.rooms.rooms;
    if (!userState || !userState.roomId) return null;

    const roomName = userState.roomName ? `#${userState.roomName}` : 'My room';
    return (
        <div eventKey="room" title={roomName}>
            <ConnectedPlayers isLobby={false} roomId={userState.roomId} rooms={rooms} />
            <ChatWindow isLobby={false} states={states} />
        </div>
    );
};

const Channels = ({ states }) => {
    const userState = states.user;

    const [activeTab, setActiveTab] = useState('lobby');
    useEffect(() => {
        userState.roomId ? setActiveTab('room') : setActiveTab('lobby');
    }, [userState.roomId]);

    return (
        <div className={css['container']}>
            <Tabs
                id="chat-panel"
                activeKey={activeTab}
                onSelect={tab => setActiveTab(tab)}
                className={css.tabs}
            >
                {lobbyTab(states)}
                {roomTab(states)}
            </Tabs>
        </div>
    );
};

export default Channels;
