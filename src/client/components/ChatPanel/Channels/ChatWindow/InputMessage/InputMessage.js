import React, { useEffect, useState } from 'react';

import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import css from './InputMessage.module.css';

const InputMessage = ({}) => {
    fontAwesomeLibrary.add(faPaperPlane);

    const [message, setMessage] = useState('');
    const [iconClasses, setIconClasses] = useState(css.icon);

    useEffect(() => {
        console.debug('[InputMessage] rendering');
    });

    const onChangeInput = event => {
        const msg = event.target.value.trim();
        setMessage(msg);
        msg.length ? setIconClasses([css.icon, css.send].join(' ')) : setIconClasses(css.icon);
    };

    const sendMessage = () => {
        if (message.length) {
            alert(`|${message}|`);
        }
    };

    const onKeyDown = event => {
        if (event.key === 'Enter') {
            sendMessage();
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
