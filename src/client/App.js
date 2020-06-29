import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';

import Home from './containers/Home.container';

import 'react-toastify/dist/ReactToastify.css';
import './actions/notifications/notifications.css';
import { configureNotificationContainer } from './actions/notifications';
import { handleHashRoute } from './actions/common/hashRoute';

configureNotificationContainer();

const App = ({ store }) => {
    const location = useLocation();
    let history = useHistory();

    useEffect(() => {
        console.log('OUAAAAAI GROS');
        handleHashRoute(store, location.hash);
    }, [location.hash]);

    return (
        <>
            <Route
                path="/"
                exact
                render={props => <Home {...props} history={history} store={store} />}
            />
        </>
    );
};

export default App;
