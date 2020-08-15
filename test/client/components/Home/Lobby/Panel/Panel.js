/* Dependencies */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

/* Components */
import Panel from '../../../../../../src/client/components/Home/Lobby/Panel/Panel';
import Tabs from '../../../../../../src/client/components/Home/Lobby/Panel/Tabs/Tabs';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<Panel /> component', () => {
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

    it('should render Panel without error', () => {
        // const consoleStub = sandbox.stub(console, 'debug');
        const wrapper = mount(<Panel {...PROPS} />);

        const tabs = wrapper.find(Tabs);
        expect(tabs).to.have.lengthOf(1);
        // expect(consoleStub.args).to.deep.equal([['[Lobby] Rendering']]);

        wrapper.unmount();
    });
});
