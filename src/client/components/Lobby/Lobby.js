import React, { useEffect } from 'react';

import { store } from '../../index';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
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
        console.log('[Loby] Rendering');
    }, [userState.roomId]);

    return (
        <div className={css.container}>
            <Header />
            {displayRoomsOrGame(userState)}
            <Footer />
        </div>
    );
};

export default Lobby;
