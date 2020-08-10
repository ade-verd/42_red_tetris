/* Dependencies */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { render, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

/* Components */
import AsideLeft from '../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/AsideLeft/AsideLeft';
import Display from '../../../../../../../../src/client/components/Home/Lobby/Playground/Display/Display';
import { StyledAsideLeft } from '../../../../../../../../src/client/components/Home/Lobby/Playground/FieldWrapper/AsideLeft/AsideLeft.style';

// Configure enzyme for react 16
Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

describe('<AsideLeft /> component', () => {
    const sandbox = sinon.createSandbox();
    const PROPS = {
        gameStatus: { score: 0, rows: 0, level: 1 },
    };

    afterEach(() => {
        sandbox.restore();
    });

    it('should render AsideLeft without error', () => {
        const wrapper = mount(<AsideLeft {...PROPS} />);
        const styledWrapper = wrapper.find(StyledAsideLeft);
        const displays = wrapper.find(Display);
        const display1 = <Display title="SCORE" content={PROPS.gameStatus.score} />;
        const display2 = <Display title="ROWS" content={PROPS.gameStatus.rows} />;
        const display3 = <Display title="LEVEL" content={PROPS.gameStatus.level} />;

        expect(styledWrapper).to.have.lengthOf(1);
        expect(displays).to.have.lengthOf(3);
        expect(wrapper.contains(display1)).to.equal(true);
        expect(wrapper.contains(display2)).to.equal(true);
        expect(wrapper.contains(display3)).to.equal(true);
    });
});
