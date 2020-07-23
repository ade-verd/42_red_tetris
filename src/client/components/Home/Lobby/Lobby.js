import React, { useEffect } from 'react';

import Highscores from './Highscores/Highscores';
import ChatPanel from './ChatPanel/ChatPanel';
import Playground from '../../../containers/Playground.container';
import Rooms from '../../../containers/Rooms.container';

import css from './Lobby.module.css';

const Lobby = ({ states }) => {
    const displayGame = states.user && states.user.roomId;

    useEffect(() => {
        console.log('[Lobby] Rendering');
    }, [states.user.roomId]);

    return (
        <div className={css.container}>
            {displayGame ? null : <Highscores />}
            {displayGame ? <Playground /> : <Rooms />}
            <ChatPanel states={states} />
        </div>
    );
};

export default Lobby;
