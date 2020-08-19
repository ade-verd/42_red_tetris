import React from 'react';

import css from './Errors.module.css';

export const E404_NotFound = ({}) => {
    const ERROR_MESSAGE = 'Error 404: Not Found';

    return (
        <div className={css.container}>
            <div className={css.item}>{ERROR_MESSAGE}</div>;
        </div>
    );
};

export default E404_NotFound;
