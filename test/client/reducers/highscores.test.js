import { expect } from 'chai';
import sinon from 'sinon';

import reducer from '../../../src/client/reducers/highscores';

describe('client/reducers/highscores', function() {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sinon.stub(console, 'debug');
        sinon.stub(console, 'error');
    });

    afterEach(() => {
        console.debug.restore();
        console.error.restore();
        sandbox.restore();
    });

    describe('UPDATE_HIGHSCORES', function() {
        it('should update the state', function() {
            const action = { type: 'UPDATE_HIGHSCORES', highscores: [] };
            const expectedState = { highscores: [] };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });

        it('should send error and not update', function() {
            const action = { type: 'UPDATE_HIGHSCORES', highscores: [], error: 'defined' };
            const expectedState = {};

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });

    describe('default', function() {
        it('should not touch the state', function() {
            const action = { type: 'none' };
            const expectedState = {};

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });
});
