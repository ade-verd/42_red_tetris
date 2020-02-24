'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const Game = require('../../../../src/server/lib/games/classGame');
const actions = require('../../../../src/server/lib/games/gameActions.js');

describe('lib/games/classGame', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#new Game()', () => {
        it('should create a new Game', async () => {
            const game = new Game({ roomId: '000000000000000000000001' });
            expect(game.roomId).to.equal('000000000000000000000001');
        });

        it('should run start action', async () => {
            const actionStub = sandbox.stub(actions, 'start').resolves('action succeed');

            const game = new Game({ roomId: '000000000000000000000001' });
            const res = await game.start();

            expect(actionStub.args).to.deep.equal([['000000000000000000000001']]);
            expect(res).to.equal('action succeed');
        });

        it('should run pause action', async () => {
            const actionStub = sandbox.stub(actions, 'pause').resolves('action succeed');

            const game = new Game({ roomId: '000000000000000000000001' });
            const res = await game.pause();

            expect(actionStub.args).to.deep.equal([['000000000000000000000001']]);
            expect(res).to.equal('action succeed');
        });

        it('should run resume action', async () => {
            const actionStub = sandbox.stub(actions, 'resume').resolves('action succeed');

            const game = new Game({ roomId: '000000000000000000000001' });
            const res = await game.resume();

            expect(actionStub.args).to.deep.equal([['000000000000000000000001']]);
            expect(res).to.equal('action succeed');
        });

        it('should run stop actions', async () => {
            const actionStub = sandbox.stub(actions, 'stop').resolves('action succeed');

            const game = new Game({ roomId: '000000000000000000000001' });
            const res = await game.stop();

            expect(actionStub.args).to.deep.equal([['000000000000000000000001']]);
            expect(res).to.equal('action succeed');
        });
    });
});
