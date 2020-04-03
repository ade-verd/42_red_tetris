import React, { useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';

import css from './NavTabs.module.css';

const NavTabs = () => {
    return (
        <div className={css['container']}>
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <div eventKey="home" title="Home">
                    Blablabla1
                </div>
                <div eventKey="profile" title="Profile">
                    Blablabla2
                </div>
                <div eventKey="contact" title="Contact" disabled>
                    Blablabla2
                </div>
            </Tabs>
        </div>
    );
};

export default NavTabs;
