import _ from 'lodash';

import React, { useEffect, useState } from 'react';

import css from './MessageList.module.css';

const renderMessages = msgList => {
    return msgList.map(msgData => (
        <div className={css.msgContainer}>
            <span className={css.author}>{msgData.fromPlayerName}</span>
            <span className={css.msg}>{msgData.message}</span>
            {/* <span>{msgData.date}</span> */}
        </div>
    ));
};

const MessageList = ({ states, isLobby }) => {
    const [msgList, setMsgList] = useState();
    const [msgToRender, setMsgToRender] = useState();

    useEffect(() => {
        const roomId = isLobby ? 'lobby' : _.get(states, 'user.roomId');
        const roomMessages = _.get(states, ['chat', 'msg', roomId]);
        setMsgList(roomMessages);
    }, [states.chat]);

    useEffect(() => {
        if (msgList) {
            setMsgToRender(renderMessages(msgList));
            console.debug('[MessageList] rendering');
        }
    }, [msgList]);

    return <div className={css['container']}>{msgToRender}</div>;
};

export default MessageList;
