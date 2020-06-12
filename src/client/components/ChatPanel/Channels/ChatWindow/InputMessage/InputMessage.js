import React, { useEffect, useState } from 'react';

import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { emitChatMessage } from '../../../../../actions/chat/chat';

import { store } from '../../../../../index';

import css from './InputMessage.module.css';

const InputMessage = ({ isLobby }) => {
    fontAwesomeLibrary.add(faPaperPlane);

    const [message, setMessage] = useState('');
    const [iconClasses, setIconClasses] = useState(css.icon);

    useEffect(() => {
        console.debug('[InputMessage] rendering');
    });

    const onChangeInput = event => {
        const msg = event.target.value;
        setMessage(msg);
        msg.trim().length
            ? setIconClasses([css.icon, css.send].join(' '))
            : setIconClasses(css.icon);
    };

    const sendMessage = () => {
        const msg = message.trim();
        if (msg.length) {
            const userState = store.getState().usr;
            const payload = {
                playerId: userState.id,
                playerName: userState.name,
                roomId: isLobby ? 'lobby' : userState.roomId,
                msg,
            };
            emitChatMessage(store.dispatch, payload);
            setMessage('');
        }
    };

    const onKeyDown = event => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                setMessage(message + '\n');
            } else {
                sendMessage();
            }
        }
    };

    return (
        <div className={css['container']}>
            <input
                type="text"
                id="chat_input"
                className={css.input}
                placeholder="Type your message"
                onKeyDown={onKeyDown}
                onChange={onChangeInput}
                value={message}
                autoComplete="off"
                spellCheck="false"
                multiline={true}
            />
            <span className={iconClasses} onClick={sendMessage}>
                <FontAwesomeIcon icon={['fas', 'paper-plane']} title="Send" />
            </span>
        </div>
    );
};

export default InputMessage;
