/* Dependencies */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import store from '../../../../../../src/client/store/store';
import * as helpers from '../../../../../../src/client/helpers/getRoom';

/* Components */
import Rooms from '../../../../../../src/client/components/Home/Lobby/Rooms/Rooms';
import CreateRoom from '../../../../../../src/client/components/Home/Lobby/Rooms/CreateRoom/CreateRoom';
import DisplayRooms from '../../../../../../src/client/components/Home/Lobby/Rooms/DisplayRooms/DisplayRooms';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<Rooms /> component', () => {
    const sandbox = sinon.createSandbox();
    const PROPS = {
        players: {},
        rooms: { rooms: [] },
        user: { id: '01', roomId: '' },
        listen: sandbox.stub().returns(),
        emitGetActiveRooms: sandbox.stub().returns(),
    };

    after(() => {
        sandbox.restore();
    });

    it('should render Rooms without error', () => {
        const wrapper = mount(<Rooms {...PROPS} />);

        const createRoom = wrapper.find(CreateRoom);
        const displayRooms = wrapper.find(DisplayRooms);
        expect(createRoom).to.have.lengthOf(1);
        expect(displayRooms).to.have.lengthOf(1);

        wrapper.unmount();
    });
});
