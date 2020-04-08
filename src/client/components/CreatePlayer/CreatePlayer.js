import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { store } from '../../index';

import { emitCreatePlayer } from '../../actions/players/createPlayer';
import { setUserCookieSettings } from '../../actions/players/userCookie';

import css from './CreatePlayer.module.css';

const CreatePlayer = ({}) => {
    fontAwesomeLibrary.add(faUserPlus);

    const [inputPlayer, setInputPlayer] = useState('');
    const [rememberMeValue, setRememberMe] = useState(false);

    const replaceWideChars = event => {
        setInputPlayer(event.target.value.replace(/[^\w- ]/gi, ''));
    };

    const onRememberMeChange = () => {
        setRememberMe(!rememberMeValue);
    };

    const createPlayer = event => {
        if (event.key === 'Enter') {
            setUserCookieSettings(store.dispatch, rememberMeValue);
            emitCreatePlayer(store.dispatch, event.target.value.trim());
        }
    };

    return (
        <div className={css.container}>
            <div className={css.item}>
                <FontAwesomeIcon className={css.grey} icon={['fas', 'user-plus']} size="8x" />
            </div>
            <div className={css.item}>
                <div>Create player:</div>
                <input
                    type="text"
                    id="create_player_input"
                    className={css.input}
                    value={inputPlayer}
                    onKeyDown={createPlayer}
                    onChange={replaceWideChars}
                    autoComplete="off"
                    spellCheck="false"
                    required
                />
            </div>
            <Form.Check
                id="create_player_switch"
                className={rememberMeValue ? css.white : css.grey}
                type="switch"
                label="Remember me"
                defaultChecked={rememberMeValue}
                onChange={onRememberMeChange}
            />
        </div>
    );
};

export default CreatePlayer;
