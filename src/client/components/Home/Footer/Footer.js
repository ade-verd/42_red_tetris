import React from 'react';
import { library as fontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';

import css from './Footer.module.css';

import { AUTHORS, REPO_URL } from '../../../../constants';

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
    return AUTHORS.map((author, i) => {
        return (
            <div key={`author_${i}`} className={css.item}>
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
            {repoLink()}
            {authorsDiv()}
        </div>
    );
};

export default Footer;
