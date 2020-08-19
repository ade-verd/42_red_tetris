import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';

import Home from './containers/Home.container';
import E404_NotFound from './components/Errors/E404_NotFound';

import 'react-toastify/dist/ReactToastify.css';
import './actions/notifications/notifications.css';
import { configureNotificationContainer } from './actions/notifications';
import { handleHashRoute } from './actions/common/hashRoute';

configureNotificationContainer();

const App = ({ store }) => {
    const location = useLocation();
    let history = useHistory();

    useEffect(() => {
        handleHashRoute(store, location.hash);
    }, [location.hash]);

    return (
        <Switch>
            <Route
                path="/"
                exact
                render={props => <Home {...props} history={history} store={store} />}
            />
            <Route path="*" component={E404_NotFound} status={404} />
        </Switch>
    );
};

export default App;
