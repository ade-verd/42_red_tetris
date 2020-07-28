import _, { last } from 'lodash';

import React, { useEffect, useState, useRef, useCallback } from 'react';

import { timestampToDatetime } from '../../../../../../../helpers/utils/date';

import css from './MessageList.module.css';

const renderMessages = (userState, msgList, setLastMessageRef) => {
    const userId = userState.id;
    let lastAuthorId;
    const msgListLength = msgList && msgList.length;

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
};

const Message = ({ isLobby, states }) => buildMessage();

export default React.memo(Message);
