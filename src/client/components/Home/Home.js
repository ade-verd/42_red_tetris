import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import CreatePlayer from '../CreatePlayer/CreatePlayer';
import Footer from '../Footer/Footer';
import Lobby from '../Lobby/Lobby';
import Header from '../Header/Header';

import { handleHashRoute } from '../../actions/common/hashRoute';

import css from './Home.module.css';

const displayCreatePlayerOrLobby = states => {
    const user = states.user;
    if (!user || !user.id) {
        return <CreatePlayer />;
    }
    return <Lobby states={states} />;
};

export const Home = ({ store, chat, user, rooms, ...dispatchs }) => {
    const location = useLocation();
    let history = useHistory();

    useEffect(() => {
        handleHashRoute(store, location.hash);
    }, [location.hash]);

    useEffect(() => {
        const roomName = user.roomName ? user.roomName : '';
        const userName = user.name ? `[${user.name}]` : '';
        const path = roomName || userName ? `#${roomName}${userName}` : '';
        history.push(path);
    }, [user, user.name, user.roomName]);

    useEffect(() => {
        dispatchs.listen(store);
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
