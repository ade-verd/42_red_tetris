'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb'); 

const config = require('../../../../src/server/config');

const dbLib = require('../../../../src/server/lib/mongodb');

const roomsModels = require('../../../../src/server/models/rooms');
const { DATABASE, COLLECTION } = require('../../../../src/server/models/rooms/definition');

const fixtures = require('../../../fixtures/rooms.fixtures');

describe.skip('models/rooms', () => {
	let db;
	// const sandbox = sinon.sandbox.create();

	before(async () => {
		await dbLib.connect();
		db = await dbLib.getDb();
	});

	beforeEach(async () => {
		console.log(db);
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
			await db.collection(COLLECTION).insertMany(fixtures.default[0]);
		});

		it('should find all rooms', async () => {
			const ROOM_ID = '000000000000000000000001';

			const res = roomsModels.find(b, ROOM_ID);

			expect(res).to.deep.equal({
				_id: new ObjectId('000000000000000000000001'),
				room_name: 'room_name_1',
				players_ids: ['00000000000000000000000a'],
				game_status: 'waiting',
				block_list: [],
				settings: [],
				created_at: "2020-01-01T10:00:00Z",
				updated_at: "2020-01-01T10:00:00Z",
			});
		});
	});
});