import React, { useEffect } from 'react';

import { store } from '../../index';

import CreatePlayer from '../CreatePlayer/CreatePlayer';
import Footer from '../Footer/Footer';
import Lobby from '../Lobby/Lobby';
import Header from '../Header/Header';

import css from './Home.module.css';

const displayCreatePlayerOrLobby = user => {
    if (!user || !user.id) {
        return <CreatePlayer />;
    }
    return <Lobby />;
};

const Home = ({ user, ...dispatchs }) => {
    useEffect(() => {
        dispatchs.listen();
        dispatchs.checkUserCookie(store.dispatch);
    }, []);

    useEffect(() => {
        console.log('[Home] Rendering');
    }, [user.id]);

    return (
        <div className={css.container}>
            <Header />
            {displayCreatePlayerOrLobby(user)}
            <Footer />
        </div>
    );
};

export default Home;
