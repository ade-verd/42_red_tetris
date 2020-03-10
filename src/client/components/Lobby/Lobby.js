import React, { useEffect } from 'react';

import { store } from '../../index';

import Header from '../Header/Header';
import Rooms from '../../containers/Rooms.container';
import Playground from '../../containers/Playground.container';

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
        console.log('[Loby] Rendering');
    }, [userState.roomId]);

    return (
        <div className={css.container}>
            <Header />
            {displayRoomsOrGame(userState)}
        </div>
    );
};

export default Lobby;
