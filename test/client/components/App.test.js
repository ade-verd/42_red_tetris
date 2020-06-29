import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { configure as configureEnzyme, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { StaticRouter as Router, useLocation } from 'react-router-dom';
import sinon from 'sinon';

import 'jsdom-global/register';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import { configureStore } from '../../helpers/client';
import rootReducer from '../../../src/client/reducers';

import App from '../../../src/client/App';

import * as hashRoute from '../../../src/client/actions/common/hashRoute';

configureEnzyme({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<App />', function() {
    const sandbox = sinon.createSandbox();

    const initialState = {};
    const store = configureStore(rootReducer, null, initialState, {});

    afterEach(() => {
        sandbox.restore();
    });

    it('should render App without any error', function() {
        act(() => {
            render(
                <Provider store={store}>
                    <Router>
                        <App store={store} />
                    </Router>
                </Provider>,
            );
        });
    });

    it.only('should render App without any error', function() {
        const handleHashRouteStub = sandbox.stub(hashRoute, 'handleHashRoute');

        let wrapper;
        act(() => {
            wrapper = mount(
                <Provider store={store}>
                    <Router>
                        <App store={store} />
                    </Router>
                </Provider>,
                { context: { location: { hash: '/#a[b]' } } },
            );
        });
        console.log('ARGS', handleHashRouteStub.args);
        // wrapper.setContext({ context: { location: { hash: '/#a[b]' } } });
    });
});
