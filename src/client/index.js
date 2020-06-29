import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import { store } from './store/store';

import './index.scss';

ReactDom.render(
    <Provider store={store}>
        <Router>
            <App store={store} />
        </Router>
    </Provider>,
    document.getElementById('tetris') || document.createElement('div'),
);
