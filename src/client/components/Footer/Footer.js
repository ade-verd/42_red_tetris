import React from 'react';
import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';

import css from './Footer.module.css';

import { AUTHORS, REPO_URL } from '../../../constants';

const repoLink = () => {
    return (
        <div className={css.item}>
            <a href={REPO_URL} className={css.href}>
                <FontAwesomeIcon className={css.icon} icon={['fas', 'code-branch']} />
            </a>
        </div>
    );
};

const authorsDiv = () => {
    const sortedAuthors = AUTHORS.sort(function(a, b) {
        // descending sort
        if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
        return 0;
    });
    return sortedAuthors.map(author => {
        return (
            <div className={css.item}>
                <a href={author.url} className={css.href}>
                    <span className={css.author}>{author.name}</span>
                </a>
            </div>
        );
    });
};

const Footer = () => {
    fontAwesomeLibrary.add(faCodeBranch);

    return (
        <div className={css.container}>
            {authorsDiv()}
            {repoLink()}
        </div>
    );
};

export default Footer;
