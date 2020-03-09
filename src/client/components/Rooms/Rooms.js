import React, { useEffect } from 'react';

import CreateRoom from './CreateRoom';
import DisplayRooms from './DisplayRooms';

import { store } from '../../index';

import css from './Rooms.module.css';

const Rooms = ({ rooms, players, ...dispatchs }) => {
    useEffect(() => {
        dispatchs.listen();
        dispatchs.emitGetActiveRooms(store.dispatch);
    }, []);

    useEffect(() => {
        console.debug('[Rooms] rendering');
    }, [rooms]);

    return (
        <div className={css['container']}>
            <CreateRoom />
            <br />
            <DisplayRooms activeRooms={rooms} />
        </div>
    );
};

export default Rooms;
