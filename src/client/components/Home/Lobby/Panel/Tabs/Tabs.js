import React, { useEffect, useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

import ConnectedPlayers from './ConnectedPlayers/ConnectedPlayers';
import ChatWindow from './ChatWindow/ChatWindow';
import Highscores from './Highscores/Highscores';
import TabSwitcher from './TabSwitcher/TabSwitcher';

import css from './Tabs.module.css';

const LOBBY = { label: 'lobby', icon: null };
const HIGHSCORES = {
    label: 'highscores',
    icon: <FontAwesomeIcon className={css.icon} icon={['fas', 'medal']} />,
};

const renderTab = (states, activeTab) => {
    if (activeTab === HIGHSCORES) return <Highscores highscores={states.highscores} />;

    const isLobby = activeTab === LOBBY;
    return (
        <div className={css.tabContent}>
            <ConnectedPlayers isLobby={isLobby} states={states} />
            <ChatWindow isLobby={isLobby} states={states} />
        </div>
    );
};

const Tabs = ({ states }) => {
    fontAwesomeLibrary.add(faMedal);

    const userState = states.user;

    const defaultTabs = [HIGHSCORES, LOBBY];

    const [activeTab, setActiveTab] = useState();
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        const roomName = userState.roomName;
        const roomTab = { label: roomName ? `#${userState.roomName}` : null };

        roomName ? setActiveTab(roomTab) : setActiveTab(HIGHSCORES);
        roomName ? setTabs([...defaultTabs, roomTab]) : setTabs(defaultTabs);
    }, [userState.roomId]);

    return (
        <div className={css['container']}>
            <TabSwitcher tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            {renderTab(states, activeTab)}
        </div>
    );
};

export default Tabs;
