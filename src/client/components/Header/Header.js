import React from 'react';

import BackToHome from './BackToHome/BackToHome';
import Logout from './Logout/Logout';

import css from './Header.module.css';

import { store } from '../../store/store';

const Header = () => {
    const user = store.getState().usr;

    return (
        <div className={css.container}>
            <BackToHome store={store} user={user} />
            <div className={css.title}>
                <span className={css.blue}>BLUE</span>TETRIS
            </div>
            <Logout user={user} />
        </div>
    );
};

export default Header;
