'use strict';

const { expect } = require('chai');
const { ObjectId } = require('mongodb');
const sinon = require('sinon');

const dbLib = require('../../../../src/server/lib/mongodb');

const dateLib = require('../../../../src/server/lib/utils/date.js');
const playersModels = require('../../../../src/server/models/players');

const fixtures = require('../../../fixtures/players.fixtures');

describe('models/players', () => {
    const sandbox = sinon.createSandbox();

    before(async () => {
        await dbLib.connect();
        await playersModels.createIndexes();
    });

    beforeEach(async () => {
        await playersModels.collection().deleteMany({});
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(async () => {
        await dbLib.disconnect();
    });

    describe('#find()', () => {
        beforeEach(async () => {
            await playersModels.collection().insertMany(fixtures.default());
        });

        it('should find all players', async () => {
            const res = await playersModels.find().toArray();

            expect(res).to.deep.equal([
                {
                    _id: new ObjectId('00000000000000000000000a'),
                    socket_id: '0000000001',
                    name: 'Will',
                    room_id: null,
                    blocks_consumed: 0,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
                {
                    _id: new ObjectId('00000000000000000000000b'),
                    socket_id: '0000000002',
                    room_id: null,
                    name: 'Carlton',
                    blocks_consumed: 7,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
                {
                    _id: new ObjectId('00000000000000000000000c'),
                    socket_id: '0000000003',
                    room_id: null,
                    name: 'Jeffrey',
                    blocks_consumed: 15,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
            ]);
        });

        it('should find a specific player by its id', async () => {
            const PLAYER_ID = new ObjectId('00000000000000000000000a');
            const res = await playersModels.find({ _id: PLAYER_ID }).toArray();

            expect(res).to.deep.equal([
                {
                    _id: new ObjectId('00000000000000000000000a'),
                    socket_id: '0000000001',
                    room_id: null,
                    name: 'Will',
                    blocks_consumed: 0,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
            ]);
        });

        it('should apply the projection', async () => {
            const res = await playersModels.find({}, { _id: 0, name: 1 }).toArray();

            expect(res).to.deep.equal([{ name: 'Will' }, { name: 'Carlton' }, { name: 'Jeffrey' }]);
        });
    });

    describe('#findAllByIds()', () => {
        beforeEach(async () => {
            await playersModels.collection().insertMany(fixtures.default());
        });

        it('should find all players by their id', async () => {
            const playersIds = ['00000000000000000000000a', '00000000000000000000000b'];
            const res = await playersModels.findAllByIds(playersIds);

            expect(await res.toArray()).to.deep.equal([
                {
                    _id: new ObjectId('00000000000000000000000a'),
                    socket_id: '0000000001',
                    name: 'Will',
                    room_id: null,
                    blocks_consumed: 0,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
                {
                    _id: new ObjectId('00000000000000000000000b'),
                    socket_id: '0000000002',
                    room_id: null,
                    name: 'Carlton',
                    blocks_consumed: 7,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
            ]);
        });

        it('should apply the projection', async () => {
            const playersIds = ['00000000000000000000000a', '00000000000000000000000b'];
            const projection = { _id: 0, name: 1 };
            const res = await playersModels.findAllByIds(playersIds, projection);

            expect(await res.toArray()).to.deep.equal([{ name: 'Will' }, { name: 'Carlton' }]);
        });
    });

    describe('#findAllBySocketIds()', () => {
        beforeEach(async () => {
            await playersModels.collection().insertMany(fixtures.default());
        });

        it('should find all players by their socket id', async () => {
            const socketIds = ['0000000001', '0000000002'];
            const res = await playersModels.findAllBySocketIds(socketIds);

            expect(await res.toArray()).to.deep.equal([
                {
                    _id: new ObjectId('00000000000000000000000a'),
                    socket_id: '0000000001',
                    name: 'Will',
                    room_id: null,
                    blocks_consumed: 0,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
                {
                    _id: new ObjectId('00000000000000000000000b'),
                    socket_id: '0000000002',
                    room_id: null,
                    name: 'Carlton',
                    blocks_consumed: 7,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
            ]);
        });

        it('should apply the projection', async () => {
            const socketIds = ['0000000001', '0000000002'];
            const projection = { _id: 0, name: 1 };
            const res = await playersModels.findAllBySocketIds(socketIds, projection);

            expect(await res.toArray()).to.deep.equal([{ name: 'Will' }, { name: 'Carlton' }]);
        });
    });

    describe('#findOneById()', () => {
        beforeEach(async () => {
            await playersModels.collection().insertMany(fixtures.default());
        });

        it('should find one player by its id', async () => {
            const PLAYER_ID = '00000000000000000000000a';
            const res = await playersModels.findOneById(PLAYER_ID);

            expect(res).to.deep.equal({
                _id: new ObjectId('00000000000000000000000a'),
                socket_id: '0000000001',
                room_id: null,
                name: 'Will',
                blocks_consumed: 0,
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2020-01-01T10:00:00Z'),
            });
        });

        it('should apply the projection', async () => {
            const PLAYER_ID = '00000000000000000000000a';
            const res = await playersModels.findOneById(PLAYER_ID, { _id: 0, name: 1 });

            expect(res).to.deep.equal({
                name: 'Will',
            });
        });

        it('should return null if no players is found', async () => {
            const PLAYER_ID = 'ffffffffffffffffffffffff';
            const res = await playersModels.findOneById(PLAYER_ID);

            expect(res).to.be.null;
        });
    });

    describe('#findOneBySocketId()', () => {
        beforeEach(async () => {
            await playersModels.collection().insertMany(fixtures.default());
        });

        it('should find one player by its id', async () => {
            const SOCKET_ID = '0000000001';
            const res = await playersModels.findOneBySocketId(SOCKET_ID);

            expect(res).to.deep.equal({
                _id: new ObjectId('00000000000000000000000a'),
                socket_id: '0000000001',
                room_id: null,
                name: 'Will',
                blocks_consumed: 0,
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2020-01-01T10:00:00Z'),
            });
        });

        it('should apply the projection', async () => {
            const SOCKET_ID = '0000000001';
            const res = await playersModels.findOneBySocketId(SOCKET_ID, { _id: 0, name: 1 });

            expect(res).to.deep.equal({
                name: 'Will',
            });
        });

        it('should return null if no players is found', async () => {
            const SOCKET_ID = 'ffffffffff';
            const res = await playersModels.findOneBySocketId(SOCKET_ID);

            expect(res).to.be.null;
        });
    });

    describe('#insertOne()', () => {
        beforeEach(async () => {
            await playersModels.collection().deleteMany({});
        });

        it('should insert one player successfully', async () => {
            const FAKE_DATE = new Date('2000-01-01T10:00:00Z');
            const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

            const insertedPlayer = await playersModels.insertOne(fixtures.player1());

            const playersFound = await playersModels.find({}).toArray();

            const expectedPlayer = {
                _id: insertedPlayer._id,
                socket_id: '0000000005',
                room_id: null,
                name: 'Chandler',
                blocks_consumed: 15,
                created_at: new Date('2000-01-01T10:00:00Z'),
                updated_at: new Date('2000-01-01T10:00:00Z'),
            };

            expect(dateStub.callCount).to.equal(2);
            expect(insertedPlayer).to.deep.equal(expectedPlayer);
            expect(playersFound).to.deep.equal([expectedPlayer]);
        });

        it('should throw and not insert an invalid player (empty name)', async () => {
            const invalidPlayer = { ...fixtures.player1(), name: '' };

            let error;
            try {
                await playersModels.insertOne(invalidPlayer);
            } catch (err) {
                error = err;
            }

            expect(error)
                .to.be.instanceOf(Error)
                .with.property('message', '"name" is not allowed to be empty');

            const playersFound = await playersModels.find({}).toArray();
            expect(playersFound).to.deep.equal([]);
        });
    });

    describe('#updateOne()', () => {
        beforeEach(async () => {
            await playersModels.collection().insertMany(fixtures.default());
        });

        it('should update successfully a player', async () => {
            const FAKE_DATE = new Date('2050-01-01T10:00:00Z');
            const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

            const PLAYER_ID = '00000000000000000000000a';
            const result = await playersModels.updateOne(PLAYER_ID, {
                blocks_consumed: 1,
            });

            const expectedPlayer = {
                _id: new ObjectId('00000000000000000000000a'),
                socket_id: '0000000001',
                room_id: null,
                name: 'Will',
                blocks_consumed: 1,
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2050-01-01T10:00:00Z'),
            };
            const playerFound = await playersModels.findOneById(PLAYER_ID);

            expect(dateStub.callCount).to.equal(1);
            expect(result.modifiedCount).to.equal(1);
            expect(playerFound).to.deep.equal(expectedPlayer);
        });

        it('should not update anything if the player does not exist', async () => {
            const PLAYER_ID = 'ffffffffffffffffffffffff';
            const result = await playersModels.updateOne(PLAYER_ID, {
                blocks_consumed: 1,
            });

            expect(result.matchedCount).to.equal(0);
            expect(result.modifiedCount).to.equal(0);
        });
    });

    describe('#updateMany()', () => {
        beforeEach(async () => {
            await playersModels.collection().insertMany(fixtures.playersWithRoom());
        });

        it('should update successfully players', async () => {
            const FAKE_DATE = new Date('2050-01-01T10:00:00Z');
            const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

            const ROOM_ID = '000000000000000000000001';
            const result = await playersModels.updateMany({ room_id: ROOM_ID }, { game_over: false });

            const expectedPlayers = [
                {
                    _id: new ObjectId('00000000000000000000000a'),
                    socket_id: '0000000001',
                    room_id: '000000000000000000000001',
                    name: 'Will',
                    blocks_consumed: 0,
                    game_over: false,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2050-01-01T10:00:00Z'),
                },
                {
                    _id: new ObjectId('00000000000000000000000b'),
                    socket_id: '0000000002',
                    name: 'Carlton',
                    room_id: '000000000000000000000001',
                    blocks_consumed: 7,
                    game_over: false,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2050-01-01T10:00:00Z'),
                },
                {
                    _id: new ObjectId('00000000000000000000000c'),
                    socket_id: '0000000003',
                    room_id: '000000000000000000000001',
                    name: 'Jeffrey',
                    blocks_consumed: 15,
                    game_over: false,
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2050-01-01T10:00:00Z'),
                },
            ]
            const playerA = await playersModels.findOneById('00000000000000000000000a');
            const playerB = await playersModels.findOneById('00000000000000000000000b');
            const playerC = await playersModels.findOneById('00000000000000000000000c');
            const playersFound = [ playerA, playerB, playerC ];

            expect(dateStub.callCount).to.equal(1);
            expect(result.modifiedCount).to.equal(3);
            expect(playersFound).to.deep.equal(expectedPlayers);
        });

        it('should not update anything if the identifiers do not exist', async () => {
            const ROOM_ID = '11111111111111111111111';
            const result = await playersModels.updateMany({ room_id: ROOM_ID }, { game_over: false });

            expect(result.matchedCount).to.equal(0);
            expect(result.modifiedCount).to.equal(0);
        });
    });
});
