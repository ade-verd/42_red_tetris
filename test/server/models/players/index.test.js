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
					_id: new ObjectId('000000000000000000000001'),
					name: 'Will',
					blocks_consumed: 0,
					created_at: new Date("2020-01-01T10:00:00Z"),
					updated_at: new Date("2020-01-01T10:00:00Z"),
				},
				{
					_id: new ObjectId('000000000000000000000002'),
					name: 'Carlton',
					blocks_consumed: 7,
					created_at: new Date("2020-01-01T10:00:00Z"),
					updated_at: new Date("2020-01-01T10:00:00Z"),
				},
				{
					_id: new ObjectId('000000000000000000000003'),
					name: 'Jeffrey',
					blocks_consumed: 15,
					created_at: new Date("2020-01-01T10:00:00Z"),
					updated_at: new Date("2020-01-01T10:00:00Z"),
				}
			]);
		});

		it('should find a specific player by its id', async () => {
			const PLAYER_ID = new ObjectId('000000000000000000000001');
			const res = await playersModels.find({ _id: PLAYER_ID }).toArray();

			expect(res).to.deep.equal([
				{
					_id: new ObjectId('000000000000000000000001'),
					name: 'Will',
					blocks_consumed: 0,
					created_at: new Date("2020-01-01T10:00:00Z"),
					updated_at: new Date("2020-01-01T10:00:00Z"),
				},
			]);
		});

		it('should apply the projection', async () => {
			const res = await playersModels.find({}, { _id: 0, name: 1 }).toArray();

			expect(res).to.deep.equal([
				{ name: 'Will' },
				{ name: 'Carlton' },
				{ name: 'Jeffrey' },
			]);
		});
	});

	describe('#findOneById()', () => {
		beforeEach(async () => {
			await playersModels.collection().insertMany(fixtures.default());
		});

		it('should find one player by its id', async () => {
			const PLAYER_ID = '000000000000000000000001'
			const res = await playersModels.findOneById(PLAYER_ID);

			expect(res).to.deep.equal({
				_id: new ObjectId('000000000000000000000001'),
				name: 'Will',
				blocks_consumed: 0,
				created_at: new Date("2020-01-01T10:00:00Z"),
				updated_at: new Date("2020-01-01T10:00:00Z"),
			});
		});

		it('should apply the projection', async () => {
			const PLAYER_ID = '000000000000000000000001'
			const res = await playersModels.findOneById(PLAYER_ID, { _id: 0, name: 1 });

			expect(res).to.deep.equal({
				name: 'Will',
			});
		});

		it('should return null if no players is found', async () => {
			const PLAYER_ID = 'ffffffffffffffffffffffff'
			const res = await playersModels.findOneById(PLAYER_ID);

			expect(res).to.be.null;
		});
	});

	describe('#insertOne()', () => {
		beforeEach(async () => {
			await playersModels.collection().deleteMany({});
		});

		it('should insert one player successfully', async () => {
			const FAKE_DATE = new Date("2000-01-01T10:00:00Z");
			const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

			const insertedPlayer = await playersModels.insertOne(fixtures.player1());

			const playersFound = await playersModels.find({}).toArray();

			const expectedPlayer = {
				_id: insertedPlayer._id,
				name: 'Chandler',
				blocks_consumed: 15,
				created_at: new Date("2000-01-01T10:00:00Z"),
				updated_at: new Date("2000-01-01T10:00:00Z"),
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

			const PLAYER_ID = '000000000000000000000001';
			const result = await playersModels.updateOne(PLAYER_ID, {
				blocks_consumed: 1,
			});

			const expectedPlayer = {
				_id: new ObjectId('000000000000000000000001'),
				name: 'Will',
				blocks_consumed: 1,
				created_at: new Date("2020-01-01T10:00:00Z"),
				updated_at: new Date("2050-01-01T10:00:00Z")
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
});