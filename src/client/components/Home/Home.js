import React, { useEffect } from 'react';

import { store } from '../../index';

import CreatePlayer from '../CreatePlayer/CreatePlayer';
import Lobby from '../Lobby/Lobby';

const displayCreatePlayerOrLobby = user => {
    if (!user || !user.id) {
        return <CreatePlayer />;
    }
    return <Lobby />;
};

const Home = ({ user, ...dispatchs }) => {
    useEffect(() => {
        dispatchs.listen();
    }, []);

    useEffect(() => {
        console.log('[Home] Rendering');
    }, [user.id]);

    return displayCreatePlayerOrLobby(user);
};

export default Home;
