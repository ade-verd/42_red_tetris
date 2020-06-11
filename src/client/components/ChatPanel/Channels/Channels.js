import React, { useEffect, useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';

import ConnectedPlayers from './ConnectedPlayers/ConnectedPlayers';
import ChatWindow from './ChatWindow/ChatWindow';

import css from './Channels.module.css';

const LOBBY = 'lobby';

const chatSwitcher = (tabs, activeTab, setActiveTab) => {
    const buttonsGroup = tabs.map((tabValue, i) => (
        <ToggleButton
            key={i}
            type="radio"
            variant="secondary"
            name="radio"
            value={tabValue}
            checked={activeTab === tabValue}
            onChange={e => setActiveTab(e.currentTarget.value)}
            className={css.button}
        >
            {tabValue}
        </ToggleButton>
    ));
    return <div className={css.buttonsGroup}>{buttonsGroup}</div>;
};

const renderTab = (states, activeTab) => {
    const isLobby = activeTab === LOBBY;
    return (
        <div className={css.tabContent}>
            <ConnectedPlayers isLobby={isLobby} states={states} />
            <ChatWindow isLobby={isLobby} states={states} />
        </div>
    );
};

const Channels = ({ states }) => {
    const userState = states.user;

    const [activeTab, setActiveTab] = useState(LOBBY);
    const [tabs, setTabs] = useState([LOBBY]);

    useEffect(() => {
        const roomName = userState.roomName;
        roomName ? setActiveTab(`#${roomName}`) : setActiveTab(LOBBY);
        roomName ? setTabs([LOBBY, `#${roomName}`]) : setTabs([LOBBY]);
    }, [userState.roomId]);

    return (
        <div className={css['container']}>
            {chatSwitcher(tabs, activeTab, setActiveTab)}
            {renderTab(states, activeTab)}
        </div>
    );
};

export default Channels;
