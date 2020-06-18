import React, { useEffect, useRef } from 'react';

import InputMessage from './InputMessage/InputMessage';
import MessageList from './MessageList/MessageList';

import css from './ChatWindow.module.css';

const ChatWindow = ({ isLobby, states }) => {
    useEffect(() => {
        console.debug('[ChatWindow] rendering');
    });

    const inputRef = useRef(null);

    const setFocusOnInput = () => {
        inputRef.current.focus();
    };

    return (
        <div className={css['container']} onClick={setFocusOnInput}>
            <MessageList isLobby={isLobby} states={states} />
            <InputMessage inputRef={inputRef} isLobby={isLobby} />
        </div>
    );
};

export default ChatWindow;
