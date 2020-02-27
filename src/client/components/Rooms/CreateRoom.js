import React from 'react';

import { createRoom } from '../../actions/createRoom';

const CreateRoom = props => {
    const onEnterkey = event => {
        if (event.key === 'Enter') {
            const roomName = event.target.value;
            const playerId = 'to be defined';
            props.createRoom(roomName, playerId);
            // props.socket.emit('rooms:create', createRoom(roomName, playerId));
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
