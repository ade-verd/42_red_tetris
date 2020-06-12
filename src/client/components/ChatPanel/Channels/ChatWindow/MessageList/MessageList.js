import _ from 'lodash';

import React, { useEffect, useState } from 'react';

import css from './MessageList.module.css';

const renderMessages = (userState, msgList) => {
    const userId = userState.id;

    return msgList.map(msgData => {
        const classMsgContainer = [css.msgContainer];
        const isMe = msgData.fromPlayerId === userId;
        isMe ? classMsgContainer.push(css.right) : classMsgContainer.push(css.left);

        return (
            <div className={classMsgContainer.join(' ')}>
                {isMe ? null : <span className={css.author}>{msgData.fromPlayerName}</span>}
                <span className={css.msg}>{msgData.message}</span>
                {/* <span>{msgData.date}</span>*/}
            </div>
        );
    });
};

const MessageList = ({ states, isLobby }) => {
    const [msgList, setMsgList] = useState();
    const [msgToRender, setMsgToRender] = useState('');

    useEffect(() => {
        const roomId = isLobby ? 'lobby' : _.get(states, 'user.roomId');
        const roomMessages = _.get(states, ['chat', 'msg', roomId]);
        setMsgList(roomMessages);
    }, [states.chat]);

    useEffect(() => {
        if (msgList) {
            setMsgToRender(renderMessages(states.user, msgList));
            console.debug('[MessageList] rendering');
        }
    }, [msgList]);

    return <div className={css.container}>{msgToRender}</div>;
};

export default MessageList;
