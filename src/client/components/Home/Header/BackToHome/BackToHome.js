import React from 'react';

import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import { emitLeaveRoom } from '../../../../actions/rooms/leaveRoom';

import css from './BackToHome.module.css';

function BackToHome({ store, user }) {
    fontAwesomeLibrary.add(faHome);

    if (!user || !user.roomId) return null;

    return (
        <div
            className={css.container}
            onClick={() => {
                emitLeaveRoom(store);
            }}
        >
            <span className={css.icon}>
                <FontAwesomeIcon icon={['fas', 'home']} title="Home" />
            </span>
            <span className={css.text}>Home</span>
        </div>
    );
}

export default BackToHome;
