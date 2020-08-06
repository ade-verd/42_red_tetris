import React from 'react';

import css from './Command.module.css';

const Command = ({ action, touchKey, type }) => {
    const keyClassName = [css.keyboardKey, css[type]].join(' ');

    return (
        <div className={css.container}>
            <div className={css.keyWrapper}>
                <div className={keyClassName}>{touchKey}</div>
            </div>
            <div className={css.action}>{action}</div>
        </div>
    );
};

export default React.memo(Command);
