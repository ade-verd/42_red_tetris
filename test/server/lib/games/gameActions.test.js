'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const actions = require('../../../../src/server/lib/games/gameActions');
const roomsLib = require('../../../../src/server/models/rooms');

const { GAME_STATUS } = require('../../../../src/constants');

describe('lib/games/classGame', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#start()', () => {
        it('should execute start actions', async () => {
            const updateStub = sandbox.stub(roomsLib, 'updateOne').resolves({ modifiedCount: 1 });

            const ROOM_ID = '000000000000000000000001';
            const res = await actions.start(ROOM_ID);

            expect(updateStub.args).to.deep.equal([
                ['000000000000000000000001', { game_status: GAME_STATUS.PLAYING }],
            ]);
            expect(res).to.deep.include({ modifiedCount: 1 });
        });
    });

    describe('#pause()', () => {
        it('should execute pause actions', async () => {
            const updateStub = sandbox.stub(roomsLib, 'updateOne').resolves({ modifiedCount: 1 });

            const ROOM_ID = '000000000000000000000001';
            const res = await actions.pause(ROOM_ID);

            expect(updateStub.args).to.deep.equal([
                ['000000000000000000000001', { game_status: GAME_STATUS.PAUSE }],
            ]);
            expect(res).to.deep.include({ modifiedCount: 1 });
        });
    });

    describe('#resume()', () => {
        it('should execute resume actions', async () => {
            const updateStub = sandbox.stub(roomsLib, 'updateOne').resolves({ modifiedCount: 1 });

            const ROOM_ID = '000000000000000000000001';
            const res = await actions.resume(ROOM_ID);

            expect(updateStub.args).to.deep.equal([
                ['000000000000000000000001', { game_status: GAME_STATUS.PLAYING }],
            ]);
            expect(res).to.deep.include({ modifiedCount: 1 });
        });
    });

    describe('#stop()', () => {
        it('should execute stop actions', async () => {
            const updateStub = sandbox.stub(roomsLib, 'updateOne').resolves({ modifiedCount: 1 });

            const ROOM_ID = '000000000000000000000001';
            const res = await actions.stop(ROOM_ID);

            expect(updateStub.args).to.deep.equal([
                ['000000000000000000000001', { game_status: GAME_STATUS.WAITING }],
            ]);
            expect(res).to.deep.include({ modifiedCount: 1 });
        });
    });
});
