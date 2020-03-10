import React, { useEffect } from 'react';

import Logout from './Logout/Logout';

import css from './Header.module.css';

import { store } from '../../index';

const Header = () => {
    const user = store.getState().usr;

    return (
        <div className={css.container}>
            <div className={css.title}>REDTETRIS</div>
            <div className={css['username-container']}>
                <span className={css.username}>{user.name}</span>
                <Logout className={css.logout} />
            </div>
        </div>
    );
};

export default Header;
