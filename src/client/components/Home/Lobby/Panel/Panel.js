import React, { useEffect } from 'react';

import Tabs from './Tabs/Tabs';

import css from './Panel.module.css';

const Panel = ({ states }) => {
    useEffect(() => {
        console.debug('[Panel] rendering');
    });

    return (
        <div className={css['container']}>
            <Tabs states={states} />
        </div>
    );
};

export default Panel;
