import React, { useEffect, useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';

import { store } from '../../../index';

import ConnectedPlayers from './ConnectedPlayers/ConnectedPlayers';

import css from './NavTabs.module.css';

const lobbyTab = () => {
    return (
        <div eventKey="lobby" title="Lobby">
            <ConnectedPlayers isLobby={true} />
        </div>
    );
};

const roomTab = userState => {
    if (!userState || !userState.roomId) return null;

    const roomName = userState.roomName ? `#${userState.roomName}` : 'My room';
    return (
        <div eventKey="room" title={roomName}>
            <ConnectedPlayers isLobby={false} roomId={userState.roomId} />
        </div>
    );
};

const NavTabs = () => {
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
                {lobbyTab()}
                {roomTab(userState)}
            </Tabs>
        </div>
    );
};

export default NavTabs;
