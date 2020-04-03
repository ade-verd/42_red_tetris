import React, { useEffect } from 'react';

import { store } from '../../index';

import ChatPanel from '../ChatPanel/ChatPanel';
import Playground from '../../containers/Playground.container';
import Rooms from '../../containers/Rooms.container';

import css from './Lobby.module.css';

const displayRoomsOrGame = userState => {
    if (userState && userState.roomId) {
        return <Playground />;
    }
    return <Rooms />;
};

const Lobby = ({}) => {
    const userState = store.getState().usr;

    useEffect(() => {
        console.log('[Lobby] Rendering');
    });

    return (
        <div className={css.container}>
            {displayRoomsOrGame(userState)}
            <ChatPanel />
        </div>
    );
};

export default Lobby;
