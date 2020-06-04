import React, { useEffect, useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';

import { store } from '../../../index';

import ConnectedPlayers from './ConnectedPlayers/ConnectedPlayers';

import css from './NavTabs.module.css';

const lobbyTab = lobby => {
    return (
        <div eventKey="lobby" title="Lobby">
            <ConnectedPlayers isLobby={true} roomId={null} lobby={lobby} />
        </div>
    );
};

const roomTab = (userState, rooms) => {
    if (!userState || !userState.roomId) return null;

    const roomName = userState.roomName ? `#${userState.roomName}` : 'My room';
    return (
        <div eventKey="room" title={roomName}>
            <ConnectedPlayers isLobby={false} roomId={userState.roomId} rooms={rooms} />
        </div>
    );
};

const NavTabs = ({ roomsState }) => {
    const userState = store.getState().usr;

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
                {lobbyTab(roomsState.lobby)}
                {roomTab(userState, roomsState.rooms)}
            </Tabs>
        </div>
    );
};

export default NavTabs;
