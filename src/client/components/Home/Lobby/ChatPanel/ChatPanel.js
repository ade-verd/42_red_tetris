import React, { useEffect } from 'react';

import { store } from '../../../../store/store';

import Channels from './Channels/Channels';

import css from './ChatPanel.module.css';

const ChatPanel = ({ states }) => {
    useEffect(() => {
        console.debug('[ChatPanel] rendering');
    });

    return (
        <div className={css['container']}>
            <Channels states={states} />
        </div>
    );
};

export default ChatPanel;
