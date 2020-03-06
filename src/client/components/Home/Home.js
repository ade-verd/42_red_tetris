import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { store } from '../../index';

import CreatePlayer from '../CreatePlayer/CreatePlayer';
import Rooms from '../../containers/Rooms.container';

const displayCreatePlayerOrLobby = user => {
    if (!user || !user.id) {
        return <CreatePlayer />;
    }
    return <Rooms />;
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
