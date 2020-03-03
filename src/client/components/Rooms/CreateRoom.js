import React from 'react';

import { store } from '../../index';

const roomCreationError = () => {
    const state = store.getState();
    const rooms = state.rms.rooms;

    if (rooms && rooms.roomCreationError) {
        const msg = rooms.roomCreationError;
        return <div className="error">{msg}</div>;
    }
    return null;
};

const CreateRoom = props => {
    const onEnterkey = event => {
        if (event.key === 'Enter') {
            const state = store.getState();
            const roomName = event.target.value;
            const playerId = state.play.players.me.id;
            props.createRoom(roomName, playerId);
        }
    };

    return (
        <div>
            <label>Create room:</label>
            <input type="text" id="name" onKeyDown={onEnterkey} required />
            {roomCreationError()}
        </div>
    );
};

export default CreateRoom;
