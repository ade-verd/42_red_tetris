'use strict';

const { expect } = require('chai');
const { MongoError, ObjectId } = require('mongodb');
const sinon = require('sinon');

const dbLib = require('../../../../src/server/lib/mongodb');

const dateLib = require('../../../../src/server/lib/utils/date.js');
const highscoresModels = require('../../../../src/server/models/highscores');

const fixtures = require('../../../fixtures/highscores.fixtures');
const { GAME_STATUS } = require('../../../../src/server/constants');

describe('models/highscores', () => {
	const sandbox = sinon.createSandbox();

	before(async () => {
		await dbLib.connect();
		await highscoresModels.createIndexes();
	});

	beforeEach(async () => {
		await highscoresModels.collection().deleteMany({});
	});

	afterEach(() => {
		sandbox.restore();
	});

	after(async () => {
		await dbLib.disconnect();
	});

	describe('#findHighScores()', () => {
		beforeEach(async () => {
			await highscoresModels.collection().insertMany(fixtures.default());
		});

		it('should find the 3 highscores', async () => {
			const res = await highscoresModels.findHighScores(3);

			expect(res).to.deep.equal([
				{
					_id: new ObjectId('000000000000000000000007'),
					player_id: '00000000000000000000000g',
					player_name: 'GGG',
					score: 8489498498489,
					created_at: new Date('2020-01-01T10:00:00Z'),
				},
				{
					_id: new ObjectId('000000000000000000000004'),
					player_id: '00000000000000000000000d',
					player_name: 'DDD',
					score: 8948948944,
					created_at: new Date('2020-01-01T10:00:00Z'),
				},
				{
					_id: new ObjectId('000000000000000000000003'),
					player_id: '00000000000000000000000c',
					player_name: 'CCC',
					score: 999405611,
					created_at: new Date('2020-01-01T10:00:00Z'),
				},
			]);
		});
	});

	describe('#insertOne()', () => {
		beforeEach(async () => {
			await highscoresModels.collection().deleteMany({});
		});

		it('should insert one score successfully', async () => {
			const FAKE_DATE = new Date("2000-01-01T10:00:00Z");
			const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

			const insertedScore = await highscoresModels.insertOne(fixtures.highscore());

			const scoresFound = await highscoresModels.findHighScores(10);

			const expectedScore = {
				_id: insertedScore._id,
				player_id: '00000000000000000000000j',
				player_name: 'JJJ',
				score: 99999999,
				created_at: new Date("2000-01-01T10:00:00Z"),
			};
			
			expect(dateStub.callCount).to.equal(1);
			expect(insertedScore).to.deep.equal(expectedScore);
			expect(scoresFound).to.deep.equal([expectedScore]);
		});

		it('should throw and not insert an invalid score (empty player name)', async () => {
			const invalidScore = { ...fixtures.highscore(), player_name: '' };

			let error;
			try {
				await highscoresModels.insertOne(invalidScore);
			} catch (err) {
				error = err;
			}

			expect(error)
				.to.be.instanceOf(Error)
				.with.property('message', '"player_name" is not allowed to be empty');

			const scoresFound = await highscoresModels.findHighScores(10);
			expect(scoresFound).to.deep.equal([]);
		});
	});
});