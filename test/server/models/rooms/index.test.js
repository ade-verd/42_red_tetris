'use strict';

const _ = require('lodash');
const { expect } = require('chai');
const { MongoError, ObjectId } = require('mongodb');
const sinon = require('sinon');

const config = require('../../../../src/server/config');

const dbLib = require('../../../../src/server/lib/mongodb');

const dateLib = require('../../../../src/server/lib/utils/date.js');
const roomsModels = require('../../../../src/server/models/rooms');
const { COLLECTION } = require('../../../../src/server/models/rooms/definition');

const fixtures = require('../../../fixtures/rooms.fixtures');
const { GAME_STATUS } = require('../../../../src/server/constants');

describe('models/rooms', () => {
	let db;
	const sandbox = sinon.createSandbox();

	before(async () => {
		await dbLib.connect();
		db = await dbLib.getDb();
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
					unique: true,
					key: { room_name: 1 },
					name: 'room_name_1',
					ns: 'redtetris.rooms',
					background: true
				}
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
					block_list: [],
					settings: {},
					created_at: new Date("2020-01-01T10:00:00Z"),
					updated_at: new Date("2020-01-01T10:00:00Z"),
				},
				{
					_id: new ObjectId('000000000000000000000002'),
					room_name: 'room_2',
					players_ids: [
						'00000000000000000000000a',
						'00000000000000000000000b',
					],
					game_status: 'waiting',
					block_list: [],
					settings: {},
					created_at: new Date("2020-01-01T10:00:00Z"),
					updated_at: new Date("2020-01-01T10:00:00Z"),
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
					block_list: [],
					settings: {},
					created_at: new Date("2020-01-01T10:00:00Z"),
					updated_at: new Date("2020-01-01T10:00:00Z"),
				}
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
					block_list: [],
					settings: {},
					created_at: new Date("2020-01-01T10:00:00Z"),
					updated_at: new Date("2020-01-01T10:00:00Z"),
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

	describe('#findOneById()', () => {
		beforeEach(async () => {
			await roomsModels.collection().insertMany(fixtures.default());
		});

		it('should find one room by its id', async () => {
			const ROOM_ID = '000000000000000000000001'
			const res = await roomsModels.findOneById(ROOM_ID);

			expect(res).to.deep.equal({
				_id: new ObjectId('000000000000000000000001'),
				room_name: 'room_1',
				players_ids: ['00000000000000000000000a'],
				game_status: 'waiting',
				block_list: [],
				settings: {},
				created_at: new Date("2020-01-01T10:00:00Z"),
				updated_at: new Date("2020-01-01T10:00:00Z"),
			});
		});

		it('should apply the projection', async () => {
			const ROOM_ID = '000000000000000000000001'
			const res = await roomsModels.findOneById(ROOM_ID, { _id: 0, room_name: 1});

			expect(res).to.deep.equal({
				room_name: 'room_1',
			});
		});

		it('should return null if no rooms is found', async () => {
			const ROOM_ID = 'ffffffffffffffffffffffff'
			const res = await roomsModels.findOneById(ROOM_ID);

			expect(res).to.be.null;
		});
	});

	describe('#insertOne()', () => {
		beforeEach(async () => {
			await roomsModels.collection().deleteMany({});
		});

		it('should insert one room successfully', async () => {
			const FAKE_DATE = new Date("2000-01-01T10:00:00Z");
			const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

			const insertedRoom = await roomsModels.insertOne(fixtures.room1Player());

			const roomsFound = await roomsModels.find({}).toArray();

			const expectedRoom = {
				_id: insertedRoom._id,
				room_name: 'room_4',
				players_ids: [
					'00000000000000000000000a',
				],
				game_status: 'waiting',
				block_list: [],
				settings: {},
				created_at: new Date("2000-01-01T10:00:00Z"),
				updated_at: new Date("2000-01-01T10:00:00Z"),
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
				.with.property('message', '"game_status" must be one of [waiting, playing, offline]');

			const roomsFound = await roomsModels.find({}).toArray();
			expect(roomsFound).to.deep.equal([]);
		});

		it('should throw and not insert if the room name already exists', async () => {
			await roomsModels.insertOne(fixtures.room1Player());

			let error;
			try {
				await roomsModels.insertOne(fixtures.room1Player());
			} catch (err) {
				error = err;
			}

			expect(error).to.be.instanceOf(MongoError);
			expect(error.message).to.satisfy(msg =>
				msg.startsWith('E11000 duplicate key error collection')
			);

			const roomsFound = await roomsModels.find({}).toArray();
			expect(roomsFound.length).to.equal(1);
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
				players_ids: [
					'00000000000000000000000a',
				],
				game_status: GAME_STATUS.PLAYING,
				block_list: [],
				settings: {},
				created_at: new Date("2020-01-01T10:00:00Z"),
				updated_at: new Date("2050-01-01T10:00:00Z")
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
});