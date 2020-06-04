import React, { useEffect } from 'react';

import { store } from '../../index';

import Channels from './Channels/Channels';

import css from './ChatPanel.module.css';

const ChatPanel = ({ roomsState }) => {
    useEffect(() => {
        console.debug('[ChatPanel] rendering');
    });

    return (
        <div className={css['container']}>
            <Channels roomsState={roomsState} />
        </div>
    );
};

export default ChatPanel;
