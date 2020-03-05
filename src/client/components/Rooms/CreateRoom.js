import React from 'react';

import { store } from '../../index';
import { emitCreateRoom } from '../../actions/rooms/createRoom';

const CreateRoom = props => {
    const onEnterkey = event => {
        if (event.key === 'Enter') {
            const state = store.getState();
            const roomName = event.target.value;
            const playerId = state.usr.id;
            emitCreateRoom(store.dispatch, roomName, playerId);
        }
    };

    return (
        <div>
            <label>Create room:</label>
            <input type="text" id="name" onKeyDown={onEnterkey} required />
        </div>
    );
};

export default CreateRoom;
