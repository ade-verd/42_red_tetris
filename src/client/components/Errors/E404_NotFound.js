import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import css from './Errors.module.css';

const illustration = () => (
    <div className={css.item}>
        <img src="https://media.giphy.com/media/RjoLWhQBFEcHS/giphy.gif" alt="Lost Travolta" />
    </div>
);

const errorInfo = () => {
    const ERROR_TITLE = 'Error 404';
    const ERROR_MESSAGE = 'It seems you are lost';

    return (
        <>
            <div className={css.item}>
                <p className={css.errorTitle}>{ERROR_TITLE}</p>
                <p className={css.errorMessage}>{ERROR_MESSAGE}</p>
            </div>
        </>
    );
};

const redirectInfo = () => (
    <div className={[css.item, css.redirect].join(' ')}>
        {'You will be redirected in few seconds...'}
    </div>
);

const buildError = () => (
    <div className={css.container}>
        {errorInfo()}
        {illustration()}
        {redirectInfo()}
    </div>
);

const homeRedirection = () => <Redirect to="/" />;

export const E404_NotFound = ({}) => {
    const [content, setContent] = useState(buildError());

    useEffect(() => {
        setTimeout(() => setContent(homeRedirection()), 5000);
    }, []);

    return content;
};

export default E404_NotFound;
