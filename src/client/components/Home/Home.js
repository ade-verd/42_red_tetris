import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

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
    let history = useHistory();
    const userState = store.getState().usr;

    useEffect(() => {
        console.log('[App]', { path, userState });

        const roomName = userState.roomName ? userState.roomName : '';
        const userName = userState.name ? `[${userState.name}]` : '';
        const path = roomName || userName ? `#${roomName}${userName}` : '';
        history.push(path);
        console.log('[App]', { path: `/${path}`, userState });
    }, [userState, userState.name, userState.roomName]);

    useEffect(() => {
        dispatchs.socketIoConnect(store.dispatch);
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
