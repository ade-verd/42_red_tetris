import React, { useState } from 'react';

import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { store } from '../../index';

import { emitCreatePlayer } from '../../actions/players/createPlayer';

import css from './CreatePlayer.module.css';

const createPlayer = event => {
    if (event.key === 'Enter') {
        emitCreatePlayer(store.dispatch, event.target.value.trim());
    }
};

const CreatePlayer = ({}) => {
    fontAwesomeLibrary.add(faUserPlus);

    const [inputPlayer, setInputPlayer] = useState('');

    const replaceWideChars = event => {
        setInputPlayer(event.target.value.replace(/[^\w- ]/gi, ''));
    };

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
                value={inputPlayer}
                onKeyDown={createPlayer}
                onChange={replaceWideChars}
                autoComplete="off"
                spellCheck="false"
                required
            />
        </div>
    );
};

export default CreatePlayer;
