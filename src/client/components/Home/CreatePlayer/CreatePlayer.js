import React, { useState } from 'react';

import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { store } from '../../../store/store';

import { emitCreatePlayer } from '../../../actions/players/createPlayer';

import css from './CreatePlayer.module.css';

const CreatePlayer = ({}) => {
    fontAwesomeLibrary.add(faUserPlus);

    const [inputPlayer, setInputPlayer] = useState('');

    const replaceWideChars = event => {
        setInputPlayer(event.target.value.replace(/[^\w- ]/gi, ''));
    };

    const createPlayer = event => {
        if (event.key === 'Enter') {
            emitCreatePlayer(store.dispatch, event.target.value.trim());
        }
    };

    return (
        <div className={css.container}>
            <div className={css.item}>
                <FontAwesomeIcon
                    className={[css.icon, css.grey].join(' ')}
                    icon={['fas', 'user-plus']}
                />
            </div>
            <div className={css.item}>
                <input
                    autoFocus
                    type="text"
                    id="create_player_input"
                    className={css.input}
                    value={inputPlayer}
                    placeholder="Create player"
                    onKeyDown={createPlayer}
                    onChange={replaceWideChars}
                    autoComplete="off"
                    spellCheck="false"
                    required
                />
            </div>
        </div>
    );
};

export default CreatePlayer;
