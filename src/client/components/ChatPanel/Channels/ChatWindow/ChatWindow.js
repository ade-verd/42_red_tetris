import React, { useEffect } from 'react';

import InputMessage from './InputMessage/InputMessage';
import MessageList from './MessageList/MessageList';

import css from './ChatWindow.module.css';

const ChatWindow = ({ states, isLobby }) => {
    useEffect(() => {
        console.debug('[ChatWindow] rendering');
    });

    return (
        <div className={css['container']}>
            <MessageList states={states} isLobby={isLobby} />
            <InputMessage isLobby={isLobby} />
        </div>
    );
};

export default ChatWindow;
