import React from 'react';

import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { store } from '../../index';

import { emitCreatePlayer } from '../../actions/players/createPlayer';

import css from './CreatePlayer.module.css';

const createPlayer = event => {
    if (event.key === 'Enter') {
        emitCreatePlayer(store.dispatch, event.target.value);
    }
};

const CreatePlayer = ({}) => {
    fontAwesomeLibrary.add(faUserPlus);

    return (
        <div className={css.container}>
            <div className={css['icon-container']}>
                <FontAwesomeIcon className={css.fa} icon={['fas', 'user-plus']} size="8x" />
            </div>
            <br />
            <label>Create player:</label>
            <br />
            <input
                type="text"
                id="name"
                onKeyDown={createPlayer}
                autoComplete="off"
                spellCheck="false"
                required
            />
        </div>
    );
};

export default CreatePlayer;
