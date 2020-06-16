import React, { useEffect, useRef } from 'react';

import InputMessage from './InputMessage/InputMessage';
import MessageList from './MessageList/MessageList';

import css from './ChatWindow.module.css';

const ChatWindow = ({ states, isLobby }) => {
    useEffect(() => {
        console.debug('[ChatWindow] rendering');
    });

    const inputRef = useRef(null);

    const setFocusOnInput = () => {
        inputRef.current.focus();
    };

    return (
        <div className={css['container']} onClick={setFocusOnInput}>
            <MessageList states={states} isLobby={isLobby} />
            <InputMessage inputRef={inputRef} isLobby={isLobby} />
        </div>
    );
};

export default ChatWindow;
