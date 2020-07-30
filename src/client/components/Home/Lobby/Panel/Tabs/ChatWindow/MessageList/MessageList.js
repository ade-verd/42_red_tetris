import React, { useEffect, useState, useRef, useCallback } from 'react';

import Message, { TYPES } from './Message/Message';

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

const infoMessage = () => (
    <Message msgData={{ message: `Say 👋 to other players` }} msgType={TYPES.INFO} />
);

const renderMessages = (userState, msgList, setLastMessageRef) =>
    msgList &&
    msgList.map((msgData, index, array) => {
        const isMe = msgData.fromPlayerId === userState.id;
        const msgType = isMe ? TYPES.SENT : TYPES.RECEIVED;
        const previousAuthorId = index > 0 ? array[index - 1].fromPlayerId : null;

        return (
            <Message
                key={`msg_${index}`}
                msgData={msgData}
                msgType={msgType}
                previousAuthorId={previousAuthorId}
                setLastMessageRef={setLastMessageRef}
            />
        );
    });

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
            {infoMessage()}
            {msgToRender}
        </div>
    );
};

export default React.memo(MessageList);
