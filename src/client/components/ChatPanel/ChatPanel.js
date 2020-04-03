import React, { useEffect } from 'react';

import { store } from '../../index';

import NavTabs from './NavTabs/NavTabs';

import css from './ChatPanel.module.css';

const ChatPanel = () => {
    useEffect(() => {
        console.debug('[ChatPanel] rendering');
    });

    return (
        <div className={css['container']}>
            <NavTabs />
        </div>
    );
};

export default ChatPanel;
