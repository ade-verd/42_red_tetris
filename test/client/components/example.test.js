import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { /*mount, render,*/ shallow } from 'enzyme';
import React from 'react';

import { Tetris, Board } from '../../../src/client/components/example';

chai.use(chaiEnzyme());

describe('Tetris Enzyme example', function() {
    it('should render <Board />', function() {
        const wrapper = shallow(<Tetris />);

        console.log('[debug]:\n', wrapper.debug(), '\n[/debug]');
        expect(wrapper.contains(<Board prop={'prop'} />)).to.equal(true);
        expect(wrapper.find(Board)).to.have.lengthOf(1);
        expect(wrapper.find(Board))
            .to.have.prop('prop')
            .deep.equal('prop');
    });

    it('should render <div />', function() {
        const wrapper = shallow(<Board />);

        console.log('[debug]:\n', wrapper.debug(), '\n[/debug]');
        expect(wrapper.contains(<div />)).to.equal(true);
    });
});
