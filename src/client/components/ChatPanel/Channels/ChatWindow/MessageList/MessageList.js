import _, { last } from 'lodash';

import React, { useEffect, useState, useRef, useCallback } from 'react';

import { timestampToDatetime } from '../../../../../helpers/utils/date';

import css from './MessageList.module.css';

const useHookWithRefCallback = (fn, args) => {
    const ref = useRef(null);
    const setRef = useCallback(node => {
        if (node) {
            fn({ ...args, ref });
        }

        ref.current = node;
    }, []);

    return [setRef];
};

const scrollToBottom = ({ listRef, ref: lastElement }) => {
    if (lastElement && lastElement.current) {
        listRef.current.scrollTop = lastElement.current.offsetTop;
    }
};

const renderMessages = (userState, msgList, setLastMessageRef) => {
    const userId = userState.id;
    let lastAuthorId;
    const msgListLength = msgList && msgList.length;

    return (
        msgList &&
        msgList.map((msgData, index) => {
            const classMsgContainer = [css.msgContainer];
            const isMe = msgData.fromPlayerId === userId;
            const isLastAuthor = msgData.fromPlayerId === lastAuthorId;
            isMe ? classMsgContainer.push(css.right) : classMsgContainer.push(css.left);
            lastAuthorId = msgData.fromPlayerId;
            const time = timestampToDatetime(msgData.date);
            const ref = msgListLength === index + 1 ? setLastMessageRef : null;
            const id = `msg${index}_${time.date.valueOf()}_${msgData.message}`;

            return (
                <div key={id} ref={setLastMessageRef} className={classMsgContainer.join(' ')}>
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
    const listRef = useRef(null);
    const [setLastMessageRef] = useHookWithRefCallback(scrollToBottom, { listRef });
    const [msgList, setMsgList] = useState({ ...states.chat.msg });
    const [msgToRender, setMsgToRender] = useState('');

    useEffect(() => {
        setMsgList({ ...states.chat.msg });
    }, [states.chat]);

    useEffect(() => {
        if (msgList) {
            const roomId = isLobby ? 'lobby' : states.user.roomId;
            setMsgToRender(renderMessages(states.user, msgList[roomId], setLastMessageRef));
            console.debug('[MessageList] rendering');
        }
    }, [isLobby, msgList]);

    return (
        <div className={css.container} ref={listRef}>
            {msgToRender}
        </div>
    );
};

export default MessageList;
