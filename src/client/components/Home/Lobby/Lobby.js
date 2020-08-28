import React, { useEffect } from 'react';

import Panel from './Panel/Panel';
import Playground from '../../../containers/Playground.container';
import Rooms from '../../../containers/Rooms.container';

import { checkSocketId } from '../../../actions/players/updateSocketId';

import css from './Lobby.module.css';

import { store } from '../../../store/store';

const Lobby = ({ states }) => {
    const displayGame = states.user && states.user.roomId;

    useEffect(() => {}, [states.user.roomId]);

    useEffect(() => {
        checkSocketId({ dispatch: store.dispatch, user: states.user });
    }, []);

    return (
        <div className={css.container}>
            {displayGame ? <Playground /> : <Rooms />}
            <Panel states={states} />
        </div>
    );
};

export default Lobby;
