import React, { useEffect, useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

import ConnectedPlayers from './ConnectedPlayers/ConnectedPlayers';
import ChatWindow from './ChatWindow/ChatWindow';
import Highscores from './Highscores/Highscores';

import css from './Tabs.module.css';

const LOBBY = { label: 'lobby', icon: null };
const HIGHSCORES = {
    label: 'highscores',
    icon: <FontAwesomeIcon className={css.icon} icon={['fas', 'medal']} />,
};

const buttonClass = (i, array, isChecked) => {
    const className = [css.btn];

    if (array.length < 2) className.push(css.noCursor);
    if (isChecked) className.push(css.checked);

    const isFirst = i === 0;
    if (isFirst) className.push(css.firstBtn);

    const isLast = !array[i + 1];
    if (isLast) className.push(css.lastBtn);

    return className.join(' ');
};

const tabSwitcher = (tabs, activeTab, setActiveTab) => {
    const buttonsGroup = tabs
        .filter(tab => (tab.label ? true : false))
        .map((tab, i, array) => {
            const isChecked = activeTab.label === tab.label;

            return (
                <ToggleButton
                    key={'radiotab' + i}
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={i}
                    checked={isChecked}
                    onChange={e => setActiveTab(tabs[e.currentTarget.value])}
                    className={buttonClass(i, array, isChecked)}
                >
                    {tab.icon ? tab.icon : tab.label}
                </ToggleButton>
            );
        });
    return <div className={css.buttonsGroup}>{buttonsGroup}</div>;
};

const renderTab = (states, activeTab) => {
    if (activeTab === HIGHSCORES) return <Highscores />;

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
            {tabSwitcher(tabs, activeTab, setActiveTab)}
            {renderTab(states, activeTab)}
        </div>
    );
};

export default Tabs;
