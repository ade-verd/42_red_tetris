import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './containers/Home.container';

import 'react-toastify/dist/ReactToastify.css';
import './actions/notifications/notifications.css';
import { configureNotificationContainer } from './actions/notifications';

configureNotificationContainer();

const App = ({ store }) => {
    return (
        <Router>
            <Route path="/" exact render={props => <Home {...props} store={store} />} />
        </Router>
    );
};

export default App;
