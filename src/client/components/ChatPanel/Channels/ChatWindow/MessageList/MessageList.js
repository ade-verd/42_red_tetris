import React, { useEffect } from 'react';

import css from './MessageList.module.css';

const MessageList = ({}) => {
    useEffect(() => {
        console.debug('[MessageList] rendering');
    });

    return <div className={css['container']}>Message list</div>;
};

export default MessageList;
