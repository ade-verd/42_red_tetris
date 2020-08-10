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
import Playground from '../../../../../../src/client/components/Home/Lobby/Playground/Playground';
import { StyledPlayground } from '../../../../../../src/client/components/Home/Lobby/Playground/Playground.style';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<Playground /> component', () => {
    const sandbox = sinon.createSandbox();
    const PROPS = {
        field: [],
        gameStatus: {},
        piece: {},
        players: {},
        rooms: { rooms: [] },
        spectrums: {},
        user: { id: '01', roomId: '' },
        listen: sandbox.stub().returns(),
        resetGame: sandbox.stub().returns(),
        emitGetRandomTetriminos: sandbox.stub().returns(),
        updateField: sandbox.stub().returns(),
        updateGameStatus: sandbox.stub().returns(),
        move: sandbox.stub().returns(),
        reactivateDropTime: sandbox.stub().returns(),
        drop: sandbox.stub().returns(),
    };

    // const setState = sandbox.stub();
    // const useStateStub = sandbox
    //     .stub(React, 'useState')
    //     .callsFake(initState => [initState, setState]);

    // const useRefStub = sandbox.stub(React, 'useRef').returns(42);

    let getRoomStub;
    before(() => {
        getRoomStub = sandbox.stub(helpers, 'getRoom').returns({ players_ids: ['01'] });
    });

    after(() => {
        sandbox.restore();
    });

    it('should render Playground without error', () => {
        // mount(<Playground {...PROPS} />);
        const wrapper = mount(<Playground {...PROPS} />);
        // console.log(useRefStub.callCount, PROPS.listen.args);
        // expect(PROPS.listen.args).to.deep.equal([[42]]);

        expect(getRoomStub.args[0]).to.deep.equal([PROPS.rooms.rooms, PROPS.user.roomId]);

        // expect(setState.args).to.deep.equal([]);
        // console.log(useStateStub.callCount);
        // expect(useStateStub.args).to.deep.equal([[false]]);

        const SP = wrapper.find(StyledPlayground);
        expect(SP).to.have.lengthOf(1);

        wrapper.unmount();
    });

    it('should simulate key events', () => {
        const wrapper = mount(<Playground {...PROPS} />);
        const SP = wrapper.find(StyledPlayground);

        SP.simulate('keydown');
        SP.simulate('keyup');
        expect(PROPS.move.callCount).to.deep.equal(1);
        expect(PROPS.reactivateDropTime.callCount).to.deep.equal(1);

        wrapper.unmount();
    });
});
