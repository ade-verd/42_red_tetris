'use strict';

const { expect } = require('chai');
const { MongoError, ObjectId } = require('mongodb');
const sinon = require('sinon');

const dbLib = require('../../../../src/server/lib/mongodb');

const dateLib = require('../../../../src/server/lib/utils/date.js');
const roomsModels = require('../../../../src/server/models/rooms');

const fixtures = require('../../../fixtures/rooms.fixtures');

const { GAME_STATUS, TETRIMINOS } = require('../../../../src/constants');

describe('models/rooms', () => {
    const sandbox = sinon.createSandbox();

    before(async () => {
        await dbLib.connect();
        await roomsModels.createIndexes();
    });

    beforeEach(async () => {
        await roomsModels.collection().deleteMany({});
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(async () => {
        await dbLib.disconnect();
    });

    describe('#createIndexes()', () => {
        beforeEach(async () => {
            await roomsModels.collection().dropIndexes();
        });

        it('should create indexes successfully', async () => {
            const indexesBeforeCreation = await roomsModels.collection().indexes();
            expect(indexesBeforeCreation).to.deep.equal([
                { v: 2, key: { _id: 1 }, name: '_id_', ns: 'redtetris.rooms' },
            ]);

            await roomsModels.createIndexes();

            const indexesAfterCreation = await roomsModels.collection().indexes();
            expect(indexesAfterCreation).to.deep.equal([
                { v: 2, key: { _id: 1 }, name: '_id_', ns: 'redtetris.rooms' },
                {
                    v: 2,
                    key: { room_name: 1 },
                    name: 'room_name_1',
                    ns: 'redtetris.rooms',
                    unique: true,
                    background: true,
                },
                {
                    v: 2,
                    key: { _fts: 'text', _ftsx: 1 },
                    name: 'game_status_text',
                    ns: 'redtetris.rooms',
                    background: true,
                    weights: { game_status: 1 },
                    default_language: 'english',
                    language_override: 'language',
                    textIndexVersion: 3,
                },
            ]);
        });
    });

    describe('#find()', () => {
        beforeEach(async () => {
            await roomsModels.collection().insertMany(fixtures.default());
        });

        it('should find all rooms', async () => {
            const res = await roomsModels.find().toArray();

            expect(res).to.deep.equal([
                {
                    _id: new ObjectId('000000000000000000000001'),
                    room_name: 'room_1',
                    players_ids: ['00000000000000000000000a'],
                    game_status: 'waiting',
                    blocks_list: [],
                    settings: {},
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
                {
                    _id: new ObjectId('000000000000000000000002'),
                    room_name: 'room_2',
                    players_ids: ['00000000000000000000000a', '00000000000000000000000b'],
                    game_status: 'waiting',
                    blocks_list: [],
                    settings: {},
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
                {
                    _id: new ObjectId('000000000000000000000003'),
                    room_name: 'room_3',
                    players_ids: [
                        '00000000000000000000000a',
                        '00000000000000000000000b',
                        '00000000000000000000000c',
                    ],
                    game_status: 'waiting',
                    blocks_list: [],
                    settings: {},
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
            ]);
        });

        it('should find a specific room by its id', async () => {
            const ROOM_ID = new ObjectId('000000000000000000000001');
            const res = await roomsModels.find({ _id: ROOM_ID }).toArray();

            expect(res).to.deep.equal([
                {
                    _id: new ObjectId('000000000000000000000001'),
                    room_name: 'room_1',
                    players_ids: ['00000000000000000000000a'],
                    game_status: 'waiting',
                    blocks_list: [],
                    settings: {},
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
            ]);
        });

        it('should apply the projection', async () => {
            const res = await roomsModels.find({}, { _id: 0, room_name: 1 }).toArray();

            expect(res).to.deep.equal([
                { room_name: 'room_1' },
                { room_name: 'room_2' },
                { room_name: 'room_3' },
            ]);
        });
    });

    describe('#findRoomsByGameStatus()', () => {
        beforeEach(async () => {
            sandbox.stub(dateLib, 'newDate').returns(new Date('2020-01-01T10:00:00Z'));
            const fixturesWithDifferentGameStatus = [
                fixtures.room1Player(),
                fixtures.room2Players(),
                fixtures.room3Players(),
            ].map(room => roomsModels.validate(room));
            await roomsModels.collection().insertMany(fixturesWithDifferentGameStatus);
        });

        it('should find all rooms by game status', async () => {
            const res = await roomsModels.findRoomsByGameStatus(GAME_STATUS.PLAYING).toArray();

            expect(res).to.deep.equal([
                {
                    _id: res[0]._id,
                    room_name: 'room_5',
                    players_ids: ['00000000000000000000000a', '00000000000000000000000b'],
                    game_status: GAME_STATUS.PLAYING,
                    blocks_list: [],
                    settings: {},
                    created_at: new Date('2020-01-01T10:00:00Z'),
                    updated_at: new Date('2020-01-01T10:00:00Z'),
                },
            ]);
        });

        it('should find all non offline rooms', async () => {
            const regex = `^(?!${GAME_STATUS.OFFLINE})`;
            const projection = { _id: 0, created_at: 0, updated_at: 0 };
            const res = await roomsModels.findRoomsByGameStatus(regex, projection).toArray();

            expect(res).to.deep.equal([
                {
                    room_name: 'room_4',
                    players_ids: ['00000000000000000000000a'],
                    game_status: GAME_STATUS.WAITING,
                    blocks_list: [],
                    settings: {},
                },
                {
                    room_name: 'room_5',
                    players_ids: ['00000000000000000000000a', '00000000000000000000000b'],
                    game_status: GAME_STATUS.PLAYING,
                    blocks_list: [],
                    settings: {},
                },
            ]);
        });

        it('should apply the projection', async () => {
            const res = await roomsModels
                .findRoomsByGameStatus(GAME_STATUS.OFFLINE, { _id: 0, room_name: 1 })
                .toArray();

            expect(res).to.deep.equal([{ room_name: 'room_6' }]);
        });
    });

    describe('#findOneById()', () => {
        beforeEach(async () => {
            await roomsModels.collection().insertMany(fixtures.default());
        });

        it('should find one room by its id', async () => {
            const ROOM_ID = '000000000000000000000001';
            const res = await roomsModels.findOneById(ROOM_ID);

            expect(res).to.deep.equal({
                _id: new ObjectId('000000000000000000000001'),
                room_name: 'room_1',
                players_ids: ['00000000000000000000000a'],
                game_status: 'waiting',
                blocks_list: [],
                settings: {},
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2020-01-01T10:00:00Z'),
            });
        });

        it('should apply the projection', async () => {
            const ROOM_ID = '000000000000000000000001';
            const res = await roomsModels.findOneById(ROOM_ID, { _id: 0, room_name: 1 });

            expect(res).to.deep.equal({
                room_name: 'room_1',
            });
        });

        it('should return null if no rooms is found', async () => {
            const ROOM_ID = 'ffffffffffffffffffffffff';
            const res = await roomsModels.findOneById(ROOM_ID);

            expect(res).to.be.null;
        });
    });

    describe('#findOneByName()', () => {
        beforeEach(async () => {
            await roomsModels.collection().insertMany(fixtures.default());
        });

        it('should find one room by its id', async () => {
            const ROOM_NAME = 'room_1';
            const res = await roomsModels.findOneByName(ROOM_NAME);

            expect(res).to.deep.equal({
                _id: new ObjectId('000000000000000000000001'),
                room_name: 'room_1',
                players_ids: ['00000000000000000000000a'],
                game_status: 'waiting',
                blocks_list: [],
                settings: {},
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2020-01-01T10:00:00Z'),
            });
        });

        it('should apply the projection', async () => {
            const ROOM_NAME = 'room_1';
            const res = await roomsModels.findOneByName(ROOM_NAME, { _id: 1 });

            expect(res).to.deep.equal({
                _id: new ObjectId('000000000000000000000001'),
            });
        });

        it('should return null if no rooms is found', async () => {
            const ROOM_NAME = 'unknown_room';
            const res = await roomsModels.findOneByName(ROOM_NAME);

            expect(res).to.be.null;
        });
    });

    describe('#insertOne()', () => {
        beforeEach(async () => {
            await roomsModels.collection().deleteMany({});
        });

        it('should insert one room successfully', async () => {
            const FAKE_DATE = new Date('2000-01-01T10:00:00Z');
            const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

            const insertedRoom = await roomsModels.insertOne(fixtures.room1Player());

            const roomsFound = await roomsModels.find({}).toArray();

            const expectedRoom = {
                _id: insertedRoom._id,
                room_name: 'room_4',
                players_ids: ['00000000000000000000000a'],
                game_status: 'waiting',
                blocks_list: [],
                settings: {},
                created_at: new Date('2000-01-01T10:00:00Z'),
                updated_at: new Date('2000-01-01T10:00:00Z'),
            };

            expect(dateStub.callCount).to.equal(2);
            expect(insertedRoom).to.deep.equal(expectedRoom);
            expect(roomsFound).to.deep.equal([expectedRoom]);
        });

        it('should throw and not insert an invalid room (bad status)', async () => {
            const invalidRoom = { ...fixtures.room1Player(), game_status: 'bad_status' };

            let error;
            try {
                await roomsModels.insertOne(invalidRoom);
            } catch (err) {
                error = err;
            }

            expect(error)
                .to.be.instanceOf(Error)
                .with.property(
                    'message',
                    '"game_status" must be one of [waiting, playing, offline, pause]',
                );

            const roomsFound = await roomsModels.find({}).toArray();
            expect(roomsFound).to.deep.equal([]);
        });
    });

    describe('#updateOne()', () => {
        beforeEach(async () => {
            await roomsModels.collection().insertMany(fixtures.default());
        });

        it('should update successfully a room', async () => {
            const FAKE_DATE = new Date('2050-01-01T10:00:00Z');
            const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

            const ROOM_ID = '000000000000000000000001';
            const result = await roomsModels.updateOne(ROOM_ID, {
                game_status: GAME_STATUS.PLAYING,
            });

            const expectedRoom = {
                _id: new ObjectId('000000000000000000000001'),
                room_name: 'room_1',
                players_ids: ['00000000000000000000000a'],
                game_status: GAME_STATUS.PLAYING,
                blocks_list: [],
                settings: {},
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2050-01-01T10:00:00Z'),
            };
            const roomFound = await roomsModels.findOneById(ROOM_ID);

            expect(dateStub.callCount).to.equal(1);
            expect(result.modifiedCount).to.equal(1);
            expect(roomFound).to.deep.equal(expectedRoom);
        });

        it('should not update anything if the room does not exist', async () => {
            const ROOM_ID = 'ffffffffffffffffffffffff';
            const result = await roomsModels.updateOne(ROOM_ID, {
                game_status: GAME_STATUS.PLAYING,
            });

            expect(result.matchedCount).to.equal(0);
            expect(result.modifiedCount).to.equal(0);
        });
    });

    describe('#updateRoomBlockList()', () => {
        beforeEach(async () => {
            await roomsModels.collection().insertMany(fixtures.default());
        });

        it("should update successfully a room's blocks list", async () => {
            const FAKE_DATE = new Date('2050-01-01T10:00:00Z');
            const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

            const ROOM_ID = '000000000000000000000001';
            const blockList = fixtures.blocksList();

            const result = await roomsModels.updateRoomBlockList(ROOM_ID, blockList);

            const expectedRoom = {
                _id: new ObjectId('000000000000000000000001'),
                room_name: 'room_1',
                players_ids: ['00000000000000000000000a'],
                game_status: GAME_STATUS.WAITING,
                blocks_list: [
                    {
                        shape: [
                            [0, 'I', 0, 0],
                            [0, 'I', 0, 0],
                            [0, 'I', 0, 0],
                            [0, 'I', 0, 0],
                        ],
                        color: TETRIMINOS.I.color,
                        rotationsPossible: 2,
                    },
                    {
                        shape: [
                            ['O', 'O'],
                            ['O', 'O'],
                        ],
                        color: TETRIMINOS.O.color,
                        rotationsPossible: 1,
                    },
                ],
                settings: {},
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2050-01-01T10:00:00Z'),
            };
            const roomFound = await roomsModels.findOneById(ROOM_ID);

            expect(dateStub.callCount).to.equal(1);
            expect(result.modifiedCount).to.equal(1);
            expect(roomFound).to.deep.equal(expectedRoom);
        });

        it('should not update anything if the room does not exist', async () => {
            const ROOM_ID = 'ffffffffffffffffffffffff';
            const result = await roomsModels.updateRoomBlockList(ROOM_ID, ['0']);

            expect(result.matchedCount).to.equal(0);
            expect(result.modifiedCount).to.equal(0);
        });

        it('should throw if the blocks list to push is not an array', async () => {
            const ROOM_ID = '000000000000000000000001';
            const BLOCKS_LIST = {};

            let error;
            try {
                await roomsModels.updateRoomBlockList(ROOM_ID, BLOCKS_LIST);
            } catch (err) {
                error = err;
            }

            expect(error).to.be.instanceOf(MongoError);
            expect(error.message).to.satisfy(msg =>
                msg.startsWith('The argument to $each in $push must be an array'),
            );
        });
    });

    describe('#updateJoinRoom()', () => {
        beforeEach(async () => {
            const roomsWithoutAnyPlayers = fixtures
                .default()
                .map(room => ({ ...room, players_ids: [] }));
            await roomsModels.collection().insertMany(roomsWithoutAnyPlayers);
        });

        it('should join successfully a room', async () => {
            const FAKE_DATE = new Date('2050-01-01T10:00:00Z');
            const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

            const ROOM_ID = '000000000000000000000001';
            const PLAYER_ID = '00000000000000000000000a';
            const result = await roomsModels.updateJoinRoom(ROOM_ID, PLAYER_ID);

            const expectedRoom = {
                _id: new ObjectId('000000000000000000000001'),
                room_name: 'room_1',
                players_ids: ['00000000000000000000000a'],
                game_status: GAME_STATUS.WAITING,
                blocks_list: [],
                settings: {},
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2050-01-01T10:00:00Z'),
            };

            expect(dateStub.callCount).to.equal(1);
            expect(result).to.deep.equal({
                lastErrorObject: { n: 1, updatedExisting: true },
                value: expectedRoom,
                ok: 1,
            });
        });

        it('should not update anything if the room does not exist', async () => {
            const ROOM_ID = 'ffffffffffffffffffffffff';
            const PLAYER_ID = '00000000000000000000000a';
            const result = await roomsModels.updateJoinRoom(ROOM_ID, PLAYER_ID, {});

            expect(result).to.deep.equal({
                lastErrorObject: { n: 0, updatedExisting: false },
                value: null,
                ok: 1,
            });
        });

        it('should not update anything if the player already exists', async () => {
            const insertedRoom = await roomsModels.insertOne(fixtures.room1Player());

            const roomId = insertedRoom._id.toString();
            const PLAYER_ID = '00000000000000000000000a';
            const result = await roomsModels.updateJoinRoom(roomId, PLAYER_ID);

            expect(result).to.deep.equal({
                lastErrorObject: { n: 0, updatedExisting: false },
                value: null,
                ok: 1,
            });
        });
    });

    describe('#updateLeaveRoom()', () => {
        beforeEach(async () => {
            await roomsModels.collection().insertMany(fixtures.default());
        });

        it('should leave successfully a room', async () => {
            const FAKE_DATE = new Date('2050-01-01T10:00:00Z');
            const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

            const ROOM_ID = '000000000000000000000001';
            const PLAYER_ID = '00000000000000000000000a';
            const result = await roomsModels.updateLeaveRoom(ROOM_ID, PLAYER_ID);

            const expectedRoom = {
                _id: new ObjectId('000000000000000000000001'),
                room_name: 'room_1',
                players_ids: [],
                game_status: GAME_STATUS.WAITING,
                blocks_list: [],
                settings: {},
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2050-01-01T10:00:00Z'),
            };

            expect(dateStub.callCount).to.equal(1);
            expect(result).to.deep.equal({
                lastErrorObject: { n: 1, updatedExisting: true },
                value: expectedRoom,
                ok: 1,
            });
        });

        it('should not update anything if the room does not exist', async () => {
            const ROOM_ID = 'ffffffffffffffffffffffff';
            const PLAYER_ID = '00000000000000000000000a';
            const result = await roomsModels.updateLeaveRoom(ROOM_ID, PLAYER_ID);

            expect(result).to.deep.equal({
                lastErrorObject: { n: 0, updatedExisting: false },
                value: null,
                ok: 1,
            });
        });
    });
});
