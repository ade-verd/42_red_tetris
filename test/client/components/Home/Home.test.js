import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { configure as configureEnzyme, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';

import 'jsdom-global/register';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter, Provider } from 'react-redux';

import { configureStore, fakeSocket } from '../../../helpers/client';
import rootReducer from '../../../../src/client/reducers';

import App from '../../../../src/client/App';

import HomeContainer from '../../../../src/client/containers/Home.container';
import { Home as HomeComponent } from '../../../../src/client/components/Home/Home';

import CreatePlayer from '../../../../src/client/components/CreatePlayer/CreatePlayer';
import Footer from '../../../../src/client/components/Footer/Footer';
import Header from '../../../../src/client/components/Header/Header';
import Lobby from '../../../../src/client/components/Lobby/Lobby';

configureEnzyme({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<Home /> component', function() {
    const sandbox = sinon.createSandbox();

    let socket;
    let store;
    beforeEach(() => {
        const initialState = {};
        socket = fakeSocket();
        store = configureStore(rootReducer, socket, initialState, {});
    });

    const propsFixtures = () => ({
        store,
        history: [],
        players: {},
        chat: {},
        user: {},
        rooms: {},
        listen: sandbox.stub(),
        socketIoConnect: sandbox.stub(),
        checkUserCookie: sandbox.stub(),
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should shallow render Header, CreatePlayer and Footer', function() {
        const props = { ...propsFixtures() };
        const wrapper = shallow(<HomeComponent {...props} />);
        // console.log('[debug]:\n', wrapper.debug(), '\n[/debug]');

        expect(wrapper.contains(<Header />)).to.equal(true);
        expect(wrapper.contains(<CreatePlayer />)).to.equal(true);
        expect(wrapper.contains(<Footer />)).to.equal(true);
    });

    it('should shallow render Header, Lobby and Footer', function() {
        const props = { ...propsFixtures(), user: { id: '000000000000000000000001' } };
        const wrapper = shallow(<HomeComponent {...props} />);
        // console.log('[debug]:\n', wrapper.debug(), '\n[/debug]');

        expect(wrapper.contains(<Header />)).to.equal(true);
        expect(wrapper.find(Lobby))
            .to.have.prop('states')
            .to.deep.equal({
                players: {},
                chat: {},
                user: { id: '000000000000000000000001' },
                rooms: {},
            });
        expect(wrapper.contains(<Footer />)).to.equal(true);
    });

    it('should mount Home container without any error', function() {
        const props = { ...propsFixtures(), user: { id: '000000000000000000000001' } };

        const wrapper = mount(<HomeContainer {...props} />);
    });
});
