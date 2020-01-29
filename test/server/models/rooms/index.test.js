'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');

const config = require('../../../../src/server/config');

const dbLib = require('../../../../src/server/lib/mongodb');

const roomsModels = require('../../../../src/server/models/rooms');
const { DATABASE, COLLECTION } = require('../../../../src/server/models/rooms/definition');

const fixtures = require('../../../fixtures/rooms.fixtures');

describe('models/rooms', () => {
	let db;
	// const sandbox = sinon.sandbox.create();

	before(async () => {
		await dbLib.connect();
		db = await dbLib.getDb();
	});

	beforeEach(async () => {
		await db.collection(COLLECTION).deleteMany({});
	});

	afterEach(() => {
		//		sandbox.restore();
	});

	after(async () => {
		await dbLib.disconnect();
	});

	describe('#find()', () => {
		beforeEach(async () => {
			await db.collection(COLLECTION).insertMany(fixtures.default);
		});

		it('should find all rooms', async () => {
			const res = await roomsModels.find({}).toArray();

			expect(res).to.deep.equal([
				{
					_id: new ObjectId('000000000000000000000001'),
					room_name: 'room_1',
					players_ids: ['00000000000000000000000a'],
					game_status: 'waiting',
					block_list: [],
					settings: [],
					created_at: "2020-01-01T10:00:00Z",
					updated_at: "2020-01-01T10:00:00Z",
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
					settings: [],
					created_at: "2020-01-01T10:00:00Z",
					updated_at: "2020-01-01T10:00:00Z",
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
					settings: [],
					created_at: "2020-01-01T10:00:00Z",
					updated_at: "2020-01-01T10:00:00Z",
				}
			]);
		});

		it('should find a specific room by its id', async () => {
			const ROOM_ID = new ObjectId('000000000000000000000001');
			const res = await roomsModels.find({ _id: ROOM_ID}).toArray();

			expect(res).to.deep.equal([
				{
					_id: new ObjectId('000000000000000000000001'),
					room_name: 'room_1',
					players_ids: ['00000000000000000000000a'],
					game_status: 'waiting',
					block_list: [],
					settings: [],
					created_at: "2020-01-01T10:00:00Z",
					updated_at: "2020-01-01T10:00:00Z",
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
});