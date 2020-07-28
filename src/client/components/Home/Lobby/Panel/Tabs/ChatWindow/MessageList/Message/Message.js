import React from 'react';

import { timestampToDatetime } from '../../../../../../../../helpers/utils/date';

import css from './Message.module.css';

export const TYPES = { INFO: 'info', SENT: 'sent', RECEIVED: 'received' };

const buildContainerClass = msgType => {
    const className = [css.msgContainer];

    switch (msgType) {
        case TYPES.INFO:
            className.push(css.info);
            break;
        case TYPES.SENT:
            className.push(css.right);
            break;
        case TYPES.RECEIVED:
            className.push(css.left);
            break;
    }

    return className.join(' ');
};

const buildMessage = ({ msgData, msgType, previousAuthorId, setLastMessageRef }) => {
    const isLastAuthor = msgData.fromPlayerId === previousAuthorId;
    const isAuthorNameDisplayed = msgType !== TYPES.SENT && !isLastAuthor;
    const isTimeDisplayed = msgType !== TYPES.INFO;
    const time = isTimeDisplayed && timestampToDatetime(msgData.date);

    return (
        <div ref={setLastMessageRef} className={buildContainerClass(msgType)}>
            {isAuthorNameDisplayed ? (
                <div className={css.author}>{msgData.fromPlayerName}</div>
            ) : null}
            <div className={isTimeDisplayed ? css.msgAndTime : css.msgOnly}>
                <div className={css.text}>{msgData.message}</div>
                {isTimeDisplayed ? <div className={css.time}>{`${time.h}:${time.m}`}</div> : null}
            </div>
        </div>
    );
};

const Message = props => buildMessage(props);

export default React.memo(Message);
