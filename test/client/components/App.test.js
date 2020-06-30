import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { configure as configureEnzyme, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactDom from 'react-dom';
import { StaticRouter as Router, Route } from 'react-router-dom';
import sinon from 'sinon';

import 'jsdom-global/register';
import React from 'react';
import { Provider } from 'react-redux';

import { configureStore, fakeSocket } from '../../helpers/client';
import rootReducer from '../../../src/client/reducers';

import App from '../../../src/client/App';

import * as hashRoute from '../../../src/client/actions/common/hashRoute';
import HomeContainer from '../../../src/client/containers/Home.container';
import HomeComponent from '../../../src/client/components/Home/Home';

configureEnzyme({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<App />', function() {
    const sandbox = sinon.createSandbox();

    let socket;
    let store;
    beforeEach(() => {
        const initialState = {};
        socket = fakeSocket();
        store = configureStore(rootReducer, socket, initialState, {});

        sinon.stub(console, 'log');
        sinon.stub(console, 'debug');
    });

    afterEach(() => {
        sandbox.restore();
        sinon.restore();
    });

    it('should render App without any error', function() {
        render(
            <Provider store={store}>
                <Router>
                    <App store={store} />
                </Router>
            </Provider>,
        );
    });

    it('should mount App without any error', function() {
        const handleHashRouteStub = sandbox.stub(hashRoute, 'handleHashRoute');

        const wrapper = mount(
            <Provider store={store}>
                <Router>
                    <App store={store} />
                </Router>
            </Provider>,
        );

        expect(handleHashRouteStub.args).to.deep.equal([[store, '']]);
        expect(wrapper.find(Route))
            .to.have.props(['path', 'exact'])
            .deep.equal(['/', true]);
        expect(wrapper.find(HomeContainer)).to.have.lengthOf(1);
        expect(wrapper.find(HomeComponent)).to.have.lengthOf(1);
    });
});
