/* Dependencies */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

/* Components */
import NextPiece from '../../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/AsideRight/NextPiece/NextPiece';
import { StyledNextPiece } from '../../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/AsideRight/NextPiece/NextPiece.style';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<NextPiece /> component', () => {
    const sandbox = sinon.createSandbox();
    // custom piece to test every branches
    const PROPS = {
        nextPiece: [
            [0, 0, 0, 0],
            [0, 'I', 'I', 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
        ],
    };

    afterEach(() => {
        sandbox.restore();
    });

    it('should render NextPiece without error', () => {
        const wrapper = mount(<NextPiece {...PROPS} />);
        const styledWrapper = wrapper.find(StyledNextPiece);

        expect(styledWrapper).to.have.lengthOf(1);

        wrapper.unmount();
    });
});
