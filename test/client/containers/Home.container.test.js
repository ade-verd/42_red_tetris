import { expect } from 'chai';
import { configure as configureEnzyme, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'jsdom-global/register';
import React from 'react';
import { Connect, Provider } from 'react-redux';

import { configureStore } from '../../helpers/client';
import rootReducer from '../../../src/client/reducers';

import HomeContainer from '../../../src/client/containers/Home.container';
import Home from '../../../src/client/components/Home/Home';

configureEnzyme({ adapter: new Adapter() });

describe.skip('<Home /> container', function() {
    const initialState = {};
    const store = configureStore(rootReducer, null, initialState, {});

    it('should connect Home component with store and states as props', function() {
        const wrapper = shallow(
            <Provider store={store}>
                <HomeContainer />
            </Provider>,
        );

        console.log(wrapper);
        // expect(wrapper.contains(<Home />)).to.equal(true);
        // expect(wrapper.contains(<Board />)).to.equal(true);
        // expect(wrapper.find()).to.have.props([]);
    });
});
