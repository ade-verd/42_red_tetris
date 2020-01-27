'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const mongoClient = require('mongodb').MongoClient; 

const config = require('../../../../src/server/config');

const roomsModels = require('../../../../src/server/models/rooms');
const { DATABASE, COLLECTION } = require('../../../../src/server/models/rooms/definition');

const fixtures = require('../../../fixtures/rooms.fixtures');

describe.only('models/rooms', () => {
	let mongodb;
	// const sandbox = sinon.sandbox.create();

	before(async () => {
		mongodb = await mongoClient.connect(config.db.url, config.db.config);
	});

	beforeEach(async () => {
		console.log('DB:', DATABASE);
		console.log('COLLECTION:', COLLECTION);
		await mongodb.db(DATABASE).collection(COLLECTION).remove();
	});

	afterEach(() => {
//		sandbox.restore();
	});

	after(async () => {
		await mongodb.close();
	});

	describe('#get()', () => {
		beforeEach(async () => {
			await mongodb.db(DATABASE).collection(COLLECTION).insertMany(fixtures.default);
		});

		it('gets a room document by its id', async () => {
			const ROOM_ID = '000000000000000000000001';

			const res = roomsModels.get(mongodb, ROOM_ID);

			expect(res).to.deep.equal({
				_id: new ObjectId('000000000000000000000001'),
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