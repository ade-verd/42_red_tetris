import React, { useState } from 'react';

import { store } from '../../../index';
import { emitCreateRoom } from '../../../actions/rooms/createRoom';

import css from './CreateRoom.module.css';

const CreateRoom = () => {
    const [inputRoom, setInputRoom] = useState('');

    const onEnterkey = event => {
        if (event.key === 'Enter') {
            const state = store.getState();
            const roomName = event.target.value.trim();
            const playerId = state.usr.id;
            emitCreateRoom(store.dispatch, roomName, playerId);
        }
    };

    const replaceWideChars = event => {
        setInputRoom(event.target.value.replace(/[^\w-_ ]/gi, ''));
    };

    return (
        <div className={css.container}>
            <label>Create room:</label>
            <br />
            <input
                type="text"
                id="name"
                value={inputRoom}
                onKeyDown={onEnterkey}
                onChange={replaceWideChars}
                autoComplete="off"
                spellCheck="false"
                required
            />
        </div>
    );
};

export default CreateRoom;
