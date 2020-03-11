import React from 'react';

import BackToHome from './BackToHome/BackToHome';
import Logout from './Logout/Logout';

import css from './Header.module.css';

import { store } from '../../index';

const Header = () => {
    const user = store.getState().usr;

    return (
        <div className={css.container}>
            <BackToHome store={store} user={user} />
            <div className={css.title}>
                <span className={css.red}>RED</span>TETRIS
            </div>
            <Logout user={user} />
        </div>
    );
};

export default Header;
