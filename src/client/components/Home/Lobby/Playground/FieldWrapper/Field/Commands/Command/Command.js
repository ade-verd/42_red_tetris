import React from 'react';

import css from './Command.module.css';

const Command = ({ action, touchKey, type }) => {
    const keyClassName = [css.keyboard, css[code.toLowerCase()]].join(' ');

    return (
        <div className={css.container}>
            <div className={css.item}>
                <div className={keyClassName}>{touchKey}</div>
            </div>
            <div className={css.item}>{action}</div>
        </div>
    );
};

export default React.memo(Command);
