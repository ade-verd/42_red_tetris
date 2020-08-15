import { expect } from 'chai';
import sinon from 'sinon';

import reducer from '../../../src/client/reducers/spectrums';

describe('client/reducers/spetrums', function() {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sinon.stub(console, 'debug');
    });

    afterEach(() => {
        console.debug.restore();
        sandbox.restore();
    });

    describe('RESET', function() {
        it('should reset the state', function() {
            const action = { type: 'RESET' };
            const expectedState = {};

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });

    describe('SPECTRUM_SET_GAMEOVER', function() {
        it('should set gameOver', function() {
            const action = { type: 'SPECTRUM_SET_GAMEOVER', playerId: '' };
            const expectedState = { ['']: { isGameOver: true } };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });

    describe('GAMEWON', function() {
        it('should set gameWon', function() {
            const action = { type: 'GAMEWON', winnerId: '' };
            const expectedState = { ['']: { isGameWon: true } };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });
    });

    describe('SET_SPECTRUM', function() {
        it('should set the spectrum', function() {
            const action = { type: 'SET_SPECTRUM', playerId: '01', playerName: '02', spectrum: [] };
            const expectedState = { ['01']: { playerName: '02', spectrum: [] } };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });

        it('should notify warning', function() {
            const action = {
                type: 'SET_SPECTRUM',
                error: 'ValidationError',
            };
            const expectedState = { ['creationError']: action.error };

            expect(reducer(undefined, action)).to.deep.equal(expectedState);
        });

        it('should notify error', function() {
            const action = {
                type: 'SET_SPECTRUM',
                error: 'Error',
            };
            const expectedState = { ['creationError']: action.error };

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
