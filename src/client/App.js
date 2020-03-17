import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';

import Home from './containers/Home.container';

import { handleHashRoute } from './actions/common/hashRoute';

import 'react-toastify/dist/ReactToastify.css';
import './actions/notifications/notifications.css';
import { configureNotificationContainer } from './actions/notifications';

configureNotificationContainer();

const App = ({ store }) => {
    const location = useLocation();

    useEffect(() => {
        handleHashRoute(store, location.hash);
    }, [location.hash]);

    return (
        <div className="App">
            <Route path="/" exact component={Home} />
        </div>
    );
};

export default App;
