import React from 'react';

import { store } from '../../index';

import { emitCreatePlayer } from '../../actions/players/createPlayer';

const createPlayer = event => {
    if (event.key === 'Enter') {
        emitCreatePlayer(store.dispatch, event.target.value);
    }
};

const CreatePlayer = ({}) => {
    return (
        <div>
            <label>Create player:</label>
            <input type="text" id="name" onKeyDown={createPlayer} required />
        </div>
    );
};

export default CreatePlayer;
