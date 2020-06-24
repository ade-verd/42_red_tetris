import _ from 'lodash';

import React, { useEffect, useState } from 'react';

import { encodeHtmlEntity } from '../../../../../lib/utils/htmlEntities';
import { timestampToDatetime } from '../../../../../lib/utils/date';

import css from './MessageList.module.css';

const renderMessages = (userState, msgList) => {
    const userId = userState.id;
    let lastAuthorId;

    return (
        msgList &&
        msgList.map(msgData => {
            const classMsgContainer = [css.msgContainer];
            const isMe = msgData.fromPlayerId === userId;
            const isLastAuthor = msgData.fromPlayerId === lastAuthorId;
            isMe ? classMsgContainer.push(css.right) : classMsgContainer.push(css.left);
            lastAuthorId = msgData.fromPlayerId;
            const time = timestampToDatetime(msgData.date);

            return (
                <div className={classMsgContainer.join(' ')}>
                    {isMe || isLastAuthor ? null : (
                        <div className={css.author}>{msgData.fromPlayerName}</div>
                    )}
                    <div className={css.msgAndTime}>
                        <div className={css.text}>{msgData.message}</div>
                        {<div className={css.time}>{`${time.h}:${time.m}`}</div>}
                    </div>
                </div>
            );
        })
    );
};

const MessageList = ({ isLobby, states }) => {
    const [msgList, setMsgList] = useState({ ...states.chat.msg });
    const [msgToRender, setMsgToRender] = useState('');

    useEffect(() => {
        setMsgList({ ...states.chat.msg });
    }, [states.chat]);

    useEffect(() => {
        if (msgList) {
            const roomId = isLobby ? 'lobby' : states.user.roomId;
            setMsgToRender(renderMessages(states.user, msgList[roomId]));
            console.debug('[MessageList] rendering');
        }
    }, [isLobby, msgList]);

    return <div className={css.container}>{msgToRender}</div>;
};

export default MessageList;
