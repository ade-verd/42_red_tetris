import chai, { expect } from 'chai';
import { configure as configureEnzyme, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'jsdom-global/register'; // before React
import React from 'react';

import { Tetris, Board } from '../../../src/client/components/example';

configureEnzyme({ adapter: new Adapter() });

describe.only('Tetris Enzyme exemple', function() {
    it('render <Board />', function() {
        const wrapper = mount(Tetris());

        expect(
            wrapper
                .find(Board)
                .first()
                .to.have.props([]),
        );
    });
});
