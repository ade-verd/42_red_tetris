import React, { useState, useEffect } from 'react';
import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import TimeAgo from 'react-timeago';

import css from './Footer.module.css';

import { AUTHORS, REPO_URL } from '../../../../constants';

const latencyDiv = latency => {
    const value = latency && latency.value ? `~${latency.value}ms` : '-';
    const datetime = latency && latency.datetime;
    return (
        <div className={[css.item, css.latencyDiv].join(' ')}>
            <div className={css.latencyItem}>{latency ? `Ping: ${value}` : null}</div>
            <div className={css.latencyItem}>
                {datetime ? <TimeAgo date={latency.datetime} minPeriod={2} /> : null}
            </div>
        </div>
    );
};

const repoLink = () => (
    <div className={css.authorItem}>
        <a href={REPO_URL} className={css.href}>
            <FontAwesomeIcon className={css.icon} icon={['fas', 'code-branch']} />
        </a>
    </div>
);

const authorsDiv = () => {
    const authors = AUTHORS.map((author, i) => (
        <div key={`author_${i}`} className={css.authorItem}>
            <a href={author.url} className={css.href}>
                <span className={css.author}>{author.name}</span>
            </a>
        </div>
    ));
    return (
        <div className={[css.item, css.authorsDiv].join(' ')}>
            {repoLink()}
            {authors}
        </div>
    );
};

const Footer = ({ user }) => {
    fontAwesomeLibrary.add(faCodeBranch);

    const [latency, setLatency] = useState();

    useEffect(() => {
        if (user.latency) {
            setLatency(user.latency);
        }
    }, [user.latency]);

    return (
        <div className={css.container}>
            {latencyDiv(latency)}
            {authorsDiv()}
        </div>
    );
};

export default React.memo(Footer);
