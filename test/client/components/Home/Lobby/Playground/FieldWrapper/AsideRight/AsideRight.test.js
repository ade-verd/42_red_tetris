/* Dependencies */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

/* Components */
import AsideRight from '../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/AsideRight/AsideRight';
import { StyledAsideRight } from '../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/AsideRight/AsideRight.style';
import Display from '../../../../../../../../src/client/components/Home/Lobby/Playground/Display/Display';
import StartButton from '../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/AsideRight/StartButton/StartButton';
import NextPiece from '../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/AsideRight/NextPiece/NextPiece';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<AsideRight /> component', () => {
    const sandbox = sinon.createSandbox();
    const PROPS = {
        gameWon: false,
        gameOver: false,
        isAdmin: true,
        piece: [],
        playgroundRef: '',
        startGame: sandbox.stub().returns(),
        resetGame: sandbox.stub().returns(),
    };

    afterEach(() => {
        sandbox.restore();
    });

    it('should render AsideLeft without error', () => {
        const wrapper = mount(<AsideRight {...PROPS} />);
        const styledWrapper = wrapper.find(StyledAsideRight);
        const display = wrapper.find(Display);
        const startButton = wrapper.find(StartButton);
        startButton.invoke('startGame')();

        expect(styledWrapper).to.have.lengthOf(1);
        expect(display).to.have.lengthOf(1);
        expect(startButton).to.have.lengthOf(1);
        expect(PROPS.startGame.callCount).to.deep.equal(1);

        wrapper.unmount();
    });

    it('should test rest of branches', () => {
        PROPS.piece = { nextTetromino: [] };
        PROPS.isAdmin = false;
        const wrapper = mount(<AsideRight {...PROPS} />);
        const styledWrapper = wrapper.find(StyledAsideRight);
        const display = wrapper.find(Display);

        expect(styledWrapper).to.have.lengthOf(1);
        expect(display).to.have.lengthOf(1);
        expect(display.prop('content').type).to.deep.equal(NextPiece);

        wrapper.unmount();
    });
});
