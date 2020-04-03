import React, { useEffect, useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';

import { store } from '../../../index';

import css from './NavTabs.module.css';

const lobbyTab = () => {
    return (
        <div eventKey="lobby" title="Lobby">
            Lobby
        </div>
    );
};

const roomTab = roomName => {
    if (!roomName) return null;

    return (
        <div eventKey="room" title="My room">
            {roomName}
        </div>
    );
};

const NavTabs = () => {
    const [activeTab, setActiveTab] = useState('lobby');

    const userState = store.getState().usr;
    useEffect(() => {
        userState.roomId ? setActiveTab('room') : setActiveTab('lobby');
    }, [userState.roomId]);

    return (
        <div className={css['container']}>
            <Tabs activeKey={activeTab} onSelect={tab => setActiveTab(tab)} id="chat-panel">
                {lobbyTab()}
                {roomTab(userState.roomName)}
            </Tabs>
        </div>
    );
};

export default NavTabs;
