import React, { useEffect } from 'react';

import CreateRoom from './CreateRoom/CreateRoom';
import DisplayRooms from './DisplayRooms/DisplayRooms';

import { store } from '../../../../store/store';

import css from './Rooms.module.css';

const Rooms = ({ rooms, players, ...dispatchs }) => {
    useEffect(() => {
        dispatchs.listen();
        dispatchs.emitGetActiveRooms(store.dispatch);
    }, []);

    useEffect(() => {}, [rooms]);

    return (
        <div className={css['container']}>
            <CreateRoom />
            <br />
            <DisplayRooms activeRooms={rooms} />
        </div>
    );
};

export default Rooms;
