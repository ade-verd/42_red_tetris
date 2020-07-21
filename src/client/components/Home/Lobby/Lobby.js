import React, { useEffect } from 'react';

import ChatPanel from './ChatPanel/ChatPanel';
import Playground from '../../../containers/Playground.container';
import Rooms from '../../../containers/Rooms.container';

import css from './Lobby.module.css';

const displayRoomsOrGame = userState => {
    if (userState && userState.roomId) {
        return <Playground />;
    }
    return <Rooms />;
};

const Lobby = ({ states }) => {
    useEffect(() => {
        console.log('[Lobby] Rendering');
    }, [states.user.roomId]);

    return (
        <div className={css.container}>
            {displayRoomsOrGame(states.user)}
            <ChatPanel states={states} />
        </div>
    );
};

export default Lobby;
