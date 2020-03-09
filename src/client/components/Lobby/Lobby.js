import React, { useEffect } from 'react';

import { store } from '../../index';

import Rooms from '../../containers/Rooms.container';
import Playground from '../../containers/Playground.container';

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

    return displayRoomsOrGame(userState);
};

export default Lobby;
