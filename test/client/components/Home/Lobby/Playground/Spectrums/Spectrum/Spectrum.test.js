/* Dependencies */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

/* Components */
import Spectrum from '../../../../../../../../src/client/components/Home/Lobby/Playground/Spectrums/Spectrum/Spectrum';
import { StyledSpectrum } from '../../../../../../../../src/client/components/Home/Lobby/Playground/Spectrums/Spectrum/Spectrum.style';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<Spectrums /> component', () => {
    const sandbox = sinon.createSandbox();
    const PROPS = {
        players: {
            '01': 'bot',
        },
        spectrums: {
            '01': {
                spectrum: [
                    ['clear', 'clear', 'merged'],
                    ['merged', 'merged', 'merged'],
                ],
                playerName: 'bot',
                isGameOver: false,
                isGameWon: false,
            },
        },
        playerId: '01',
    };

    before(() => {
        sandbox.stub(console, 'log');
    });

    after(() => {
        sandbox.restore();
    });

    it('should render Spectrum without error', () => {
        const wrapper = mount(<Spectrum {...PROPS} />);
        const styledWrapper = wrapper.find(StyledSpectrum);

        expect(styledWrapper).to.have.lengthOf(1);

        wrapper.unmount();
    });

    it('should gameWon fieldMask', () => {
        PROPS.spectrums['01'].isGameWon = true;
        const wrapper = mount(<Spectrum {...PROPS} />);
        const styledWrapper = wrapper.find(StyledSpectrum);

        expect(styledWrapper).to.have.lengthOf(1);

        PROPS.spectrums['01'].isGameWon = false;
        wrapper.unmount();
    });

    it('should gameOver fieldMask', () => {
        PROPS.spectrums['01'].isGameOver = true;
        const wrapper = mount(<Spectrum {...PROPS} />);
        const styledWrapper = wrapper.find(StyledSpectrum);

        expect(styledWrapper).to.have.lengthOf(1);

        PROPS.spectrums['01'].isGameOver = false;
        wrapper.unmount();
    });

    it('should render empty Spectrum', () => {
        PROPS.spectrums = {};
        const wrapper = mount(<Spectrum {...PROPS} />);
        const styledWrapper = wrapper.find(StyledSpectrum);

        expect(styledWrapper).to.have.lengthOf(1);

        wrapper.unmount();
    });
});
