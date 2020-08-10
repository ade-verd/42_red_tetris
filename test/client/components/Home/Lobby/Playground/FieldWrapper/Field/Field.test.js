/* Dependencies */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

/* Components */
import Field from '../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/Field/Field';
import { StyledField } from '../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/Field/Field.style';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<Field /> component', () => {
    const sandbox = sinon.createSandbox();
    const PROPS = {
        field: [
            [
                [0, 'clear', false],
                ['I', 'merged', false],
            ],
        ],
        gameStatus: { gameWon: false, gameOver: false },
        isAdmin: false,
    };

    afterEach(() => {
        sandbox.restore();
    });

    it('should render Field without error', () => {
        const wrapper = mount(<Field {...PROPS} />);

        const SP = wrapper.find(StyledField);
        expect(SP).to.have.lengthOf(1);

        wrapper.unmount();
    });

    it('should render Field without error with game won', () => {
        PROPS.gameStatus.gameWon = true;
        const wrapper = mount(<Field {...PROPS} />);

        const SP = wrapper.find(StyledField);
        expect(SP).to.have.lengthOf(1);

        PROPS.gameStatus.gameWon = false;
        wrapper.unmount();
    });

    it('should render Field without error with game over', () => {
        PROPS.gameStatus.gameOver = true;
        const wrapper = mount(<Field {...PROPS} />);

        const SP = wrapper.find(StyledField);
        expect(SP).to.have.lengthOf(1);

        PROPS.gameStatus.gameOver = false;
        wrapper.unmount();
    });

    it('should not render Field if no field prop', () => {
        PROPS.field = null;
        const wrapper = mount(<Field {...PROPS} />);

        const SP = wrapper.find(StyledField);
        expect(SP).to.have.lengthOf(0);

        wrapper.unmount();
    });
});
