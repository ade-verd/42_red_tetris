import React, { useEffect } from 'react';

import InputMessage from './InputMessage/InputMessage';
import MessageList from './MessageList/MessageList';

import css from './ChatWindow.module.css';

const ChatWindow = ({}) => {
    useEffect(() => {
        console.debug('[ChatWindow] rendering');
    });

    return (
        <div className={css['container']}>
            <MessageList />
            <InputMessage />
        </div>
    );
};

export default ChatWindow;
