/* Dependencies */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

/* Components */
import Lobby from '../../../../../src/client/components/Home/Lobby/Lobby';
import Panel from '../../../../../src/client/components/Home/Lobby/Panel/Panel';
import * as playgroundLib from '../../../../../src/client/containers/Playground.container';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<Lobby /> component', () => {
    const sandbox = sinon.createSandbox();
    const PROPS = {
        states: {
            user: { roomId: '01' },
            chat: {},
            rooms: {},
        },
    };

    after(() => {
        sandbox.restore();
    });

    it.skip('should render Lobby without error', () => {
        // const consoleStub = sandbox.stub(console, 'debug');
        const PlaygroundStub = sandbox.stub(playgroundLib, 'default');
        const wrapper = mount(<Lobby {...PROPS} />);

        const panel = wrapper.find(Panel);
        expect(panel).to.have.lengthOf(1);
        // expect(consoleStub.args).to.deep.equal([['[Lobby] Rendering']]);
        expect(PlaygroundStub.callCount).to.deep.equal(1);

        wrapper.unmount();
    });
});
