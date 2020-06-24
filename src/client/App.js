import React, { useEffect } from 'react';
import { Route, useHistory, useLocation, withRouter } from 'react-router-dom';

import Home from './containers/Home.container';

import { handleHashRoute } from './actions/common/hashRoute';

import 'react-toastify/dist/ReactToastify.css';
import './actions/notifications/notifications.css';
import { configureNotificationContainer } from './actions/notifications';

configureNotificationContainer();

const App = ({ store }) => {
    const location = useLocation();
    let history = useHistory();

    useEffect(() => {
        handleHashRoute(store, location.hash);
    }, [location.hash]);

    return (
        <div className="App">
            <Route
                path="/"
                exact
                render={props => <Home {...props} history={history} store={store} />}
            />
        </div>
    );
};

export default withRouter(App);
