/* Dependencies */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

/* Components */
import StartButton from '../../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/AsideRight/StartButton/StartButton';
import { StyledStartButton } from '../../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/AsideRight/StartButton/StartButton.style';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<StartButton /> component', () => {
    const sandbox = sinon.createSandbox();
    // custom piece to test every branches
    const PROPS = {
        startGame: sandbox.stub(),
        resetGame: sandbox.stub(),
    };

    afterEach(() => {
        sandbox.restore();
    });

    it('should render StartButton without error', () => {
        const wrapper = mount(<StartButton {...PROPS} />);
        const styledWrapper = wrapper.find(StyledStartButton);

        expect(styledWrapper).to.have.lengthOf(1);
        styledWrapper.simulate('click');
        expect(PROPS.startGame.callCount).to.deep.equal(1);
        expect(PROPS.resetGame.callCount).to.deep.equal(0);
        styledWrapper.simulate('click');
        expect(PROPS.startGame.callCount).to.deep.equal(1);
        expect(PROPS.resetGame.callCount).to.deep.equal(1);

        wrapper.unmount();
    });
});
