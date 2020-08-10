/* Dependencies */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import * as helpers from '../../../../../../../src/client/helpers/getRoom';

/* Components */
import Spectrums from '../../../../../../../src/client/components/Home/Lobby/Playground/Spectrums/Spectrums';
import { StyledSpectrums } from '../../../../../../../src/client/components/Home/Lobby/Playground/Spectrums/Spectrums.style';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<Spectrums /> component', () => {
    const sandbox = sinon.createSandbox();
    const PROPS = {
        players: {
            '01': {
                spectrum: [],
                playerName: '',
                isGameOver: false,
                isGameWon: false,
            },
            '02': {
                spectrum: [],
                playerName: '',
                isGameOver: false,
                isGameWon: false,
            },
        },
        rooms: { rooms: null },
        spectrums: {
            '01': {
                spectrum: [],
                playerName: '',
                isGameOver: false,
                isGameWon: false,
            },
            '02': {
                spectrum: [],
                playerName: '',
                isGameOver: false,
                isGameWon: false,
            },
        },
        user: { id: '01', roomId: null },
    };

    let getRoomStub;
    before(() => {
        getRoomStub = sinon
            .stub(helpers, 'getRoom')
            .onCall(0)
            .returns({ players_ids: ['01', '02'] })
            .onCall(1)
            .returns(null)
            .onCall(2)
            .returns({ players_ids: [] });
    });

    after(() => {
        sandbox.restore();
    });

    it('should render Spectrums without error', () => {
        const wrapper = mount(<Spectrums {...PROPS} />);
        const styledWrapper = wrapper.find(StyledSpectrums);

        expect(getRoomStub.callCount).to.deep.equal(1);
        expect(styledWrapper).to.have.lengthOf(1);

        wrapper.unmount();
    });

    it('should not render if no currentRoom', () => {
        const wrapper = mount(<Spectrums {...PROPS} />);
        const styledWrapper = wrapper.find(StyledSpectrums);

        expect(getRoomStub.callCount).to.deep.equal(2);
        expect(styledWrapper).to.have.lengthOf(0);

        wrapper.unmount();
    });

    it('should not render if single player', () => {
        const wrapper = mount(<Spectrums {...PROPS} />);
        const styledWrapper = wrapper.find(StyledSpectrums);

        expect(getRoomStub.callCount).to.deep.equal(3);
        expect(styledWrapper).to.have.lengthOf(0);

        wrapper.unmount();
    });
});
