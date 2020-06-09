import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { store } from '../../index';

import CreatePlayer from '../CreatePlayer/CreatePlayer';
import Footer from '../Footer/Footer';
import Lobby from '../Lobby/Lobby';
import Header from '../Header/Header';

import css from './Home.module.css';

const displayCreatePlayerOrLobby = states => {
    const user = states.user;
    if (!user || !user.id) {
        return <CreatePlayer />;
    }
    return <Lobby states={states} />;
};

const Home = ({ chat, user, rooms, ...dispatchs }) => {
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
        dispatchs.listen();
        dispatchs.socketIoConnect(store.dispatch);
        dispatchs.checkUserCookie(store);
    }, []);

    useEffect(() => {
        console.log('[Home] Rendering');
    });

    return (
        <div className={css.container}>
            <Header />
            {displayCreatePlayerOrLobby({ chat, user, rooms })}
            <Footer />
        </div>
    );
};

export default Home;
