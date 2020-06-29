import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './store/store';

import './index.scss';

ReactDom.render(
    <Provider store={store}>
        <BrowserRouter>
            <App store={store} />
        </BrowserRouter>
    </Provider>,
    document.getElementById('tetris') || document.createElement('div'),
);
