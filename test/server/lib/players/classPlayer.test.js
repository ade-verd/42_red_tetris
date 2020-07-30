'use strict';

const { expect } = require('chai');
const { ObjectId } = require('mongodb');
const sinon = require('sinon');

const Player = require('../../../../src/server/lib/players/classPlayer.js');
const playersLib = require('../../../../src/server/models/players');

const fixtures = require('../../../fixtures/players.fixtures.js');

describe('lib/players/classPlayer', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#new Player()', () => {
        it('should create a new player', async () => {
            const insertStub = sandbox
                .stub(playersLib, 'insertOne')
                .resolves(fixtures.insertedPlayer());

            const player = await new Player({
                socketId: '0000000004',
                roomId: null,
                name: 'Waldo',
            });

            expect(insertStub.args).to.deep.equal([
                [{ socket_id: '0000000004', room_id: null, name: 'Waldo' }],
            ]);
            expect(player.id).to.equal('00000000000000000000000d');
        });

        it('should not create a new player and use an existing player id', async () => {
            const insertStub = sandbox
                .stub(playersLib, 'insertOne')
                .resolves(fixtures.insertedPlayer());

            const player = await new Player({ playerId: '00000000000000000000000d' });

            expect(insertStub.args).to.deep.equal([]);
            expect(player.id).to.equal('00000000000000000000000d');
        });
    });

    describe('#find() method', () => {
        it('should find a player', async () => {
            const insertStub = sandbox
                .stub(playersLib, 'insertOne')
                .resolves(fixtures.insertedPlayer());
            const findStub = sandbox
                .stub(playersLib, 'findOneById')
                .resolves(fixtures.insertedPlayer());

            const player = await new Player({
                socketId: '0000000004',
                roomId: null,
                name: 'Waldo',
            });
            const foundPlayer = await player.find();

            expect(insertStub.args).to.deep.equal([
                [{ socket_id: '0000000004', room_id: null, name: 'Waldo' }],
            ]);
            expect(findStub.args).to.deep.equal([['00000000000000000000000d', undefined]]);
            expect(foundPlayer).to.deep.equal({
                _id: new ObjectId('00000000000000000000000d'),
                socket_id: '0000000004',
                room_id: null,
                name: 'Waldo',
                blocks_consumed: 0,
                game_over: false,
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2020-01-01T10:00:00Z'),
            });
        });
    });

    describe('#update() method', () => {
        it('should update a player', async () => {
            const insertStub = sandbox
                .stub(playersLib, 'insertOne')
                .resolves(fixtures.insertedPlayer());
            const updateStub = sandbox.stub(playersLib, 'updateOne').resolves({ modifiedCount: 1 });

            const player = await new Player({
                socketId: '0000000004',
                roomId: null,
                name: 'Waldo',
            });
            const updateResult = await player.update({ blocks_consumed: 1 });

            expect(insertStub.args).to.deep.equal([
                [{ socket_id: '0000000004', room_id: null, name: 'Waldo' }],
            ]);
            expect(updateStub.args).to.deep.equal([
                ['00000000000000000000000d', { blocks_consumed: 1 }],
            ]);
            expect(updateResult).to.deep.equal({ modifiedCount: 1 });
        });
    });
});
