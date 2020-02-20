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

            const player = await new Player({ name: 'Waldo' });

            expect(insertStub.args).to.deep.equal([[{ name: 'Waldo' }]]);
            expect(player.id).to.equal('000000000000000000000004');
        });

        it('should not create a new player and use an existing player id', async () => {
            const insertStub = sandbox
                .stub(playersLib, 'insertOne')
                .resolves(fixtures.insertedPlayer());

            const player = await new Player({ playerId: '000000000000000000000004' });

            expect(insertStub.args).to.deep.equal([]);
            expect(player.id).to.equal('000000000000000000000004');
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

            const player = await new Player({ name: 'Waldo' });
            const foundPlayer = await player.find();

            expect(insertStub.args).to.deep.equal([[{ name: 'Waldo' }]]);
            expect(findStub.args).to.deep.equal([['000000000000000000000004', undefined]]);
            expect(foundPlayer).to.deep.equal({
                _id: new ObjectId('000000000000000000000004'),
                name: 'Waldo',
                blocks_consumed: 0,
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

            const player = await new Player({ name: 'Waldo' });
            const updateResult = await player.update({ blocks_consumed: 1 });

            expect(insertStub.args).to.deep.equal([[{ name: 'Waldo' }]]);
            expect(updateStub.args).to.deep.equal([
                ['000000000000000000000004', { blocks_consumed: 1 }],
            ]);
            expect(updateResult).to.deep.equal({ modifiedCount: 1 });
        });
    });
});
