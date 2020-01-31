'use strict';

const { expect } = require('chai');
const { MongoError, ObjectId } = require('mongodb');
const sinon = require('sinon');

const dbLib = require('../../../../src/server/lib/mongodb');

const dateLib = require('../../../../src/server/lib/utils/date.js');
const spectrumsModels = require('../../../../src/server/models/spectrums');

const fixtures = require('../../../fixtures/spectrums.fixtures');

describe('models/spectrums', () => {
	const sandbox = sinon.createSandbox();

	before(async () => {
		await dbLib.connect();
		await spectrumsModels.collection().drop();
		await spectrumsModels.createIndexes();
	});

	beforeEach(async () => {
		await spectrumsModels.collection().deleteMany({});
	});

	afterEach(() => {
		sandbox.restore();
	});

	after(async () => {
		await dbLib.disconnect();
	});

	describe('#createIndexes()', () => {
		beforeEach(async () => {
			await spectrumsModels.collection().dropIndexes();
		});

		it('should create indexes successfully', async () => {
			const indexesBeforeCreation = await spectrumsModels.collection().indexes();
			expect(indexesBeforeCreation).to.deep.equal([
				{ v: 2, key: { _id: 1 }, name: '_id_', ns: 'redtetris.spectrums' },
			]);

			await spectrumsModels.createIndexes();

			const indexesAfterCreation = await spectrumsModels.collection().indexes();
			expect(indexesAfterCreation).to.deep.equal([
				{ v: 2, key: { _id: 1 }, name: '_id_', ns: 'redtetris.spectrums' },
				{
					v: 2,
					key: { room_id: 1 },
					name: 'room_id_1',
					ns: 'redtetris.spectrums',
					background: true
				},
				{
					v: 2,
					unique: true,
					key: { room_id: 1, player_id: 1 },
					name: 'room_id_1_player_id_1',
					ns: 'redtetris.spectrums',
					background: true
				}
			]);
		});
	});

	describe('#find()', () => {
		beforeEach(async () => {
			await spectrumsModels.collection().insertMany(fixtures.default());
		});

		it('should find all spectrums', async () => {
			const res = await spectrumsModels.find().toArray();

			expect(res).to.deep.equal([
				{
					_id: new ObjectId('000000000000000000000001'),
					room_id: '000000000000000000000001',
					player_id: '00000000000000000000000a',
					spectrum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					created_at: new Date('2020-01-01T10:00:00Z'),
					updated_at: new Date('2020-01-01T10:00:00Z'),
				},
				{
					_id: new ObjectId('000000000000000000000002'),
					room_id: '000000000000000000000001',
					player_id: '00000000000000000000000b',
					spectrum: [1, 1, 1, 1, 5, 6, 7, 7, 7, 7],
					created_at: new Date('2020-01-01T10:00:00Z'),
					updated_at: new Date('2020-01-01T10:00:00Z'),
				},
				{
					_id: new ObjectId('000000000000000000000003'),
					room_id: '000000000000000000000002',
					player_id: '00000000000000000000000c',
					spectrum: [2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
					created_at: new Date('2020-01-01T10:00:00Z'),
					updated_at: new Date('2020-01-01T10:00:00Z'),
				}
			]);
		});

		it('should find a specific spectrum by its id', async () => {
			const SPECTRUM_ID = new ObjectId('000000000000000000000001');
			const res = await spectrumsModels.find({ _id: SPECTRUM_ID }).toArray();

			expect(res).to.deep.equal([
				{
					_id: new ObjectId('000000000000000000000001'),
					room_id: '000000000000000000000001',
					player_id: '00000000000000000000000a',
					spectrum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					created_at: new Date('2020-01-01T10:00:00Z'),
					updated_at: new Date('2020-01-01T10:00:00Z'),
				},
			]);
		});

		it('should apply the projection', async () => {
			const res = await spectrumsModels.find({}, { _id: 0, room_id: 1 }).toArray();

			expect(res).to.deep.equal([
				{ room_id: '000000000000000000000001' },
				{ room_id: '000000000000000000000001' },
				{ room_id: '000000000000000000000002' },
			]);
		});
	});

	describe('#findSpectrumsByRoomId()', () => {
		beforeEach(async () => {
			await spectrumsModels.collection().insertMany(fixtures.default());
		});

		it('should find all spectrums by their room id', async () => {
			const ROOM_ID = '000000000000000000000001'
			const res = await spectrumsModels.findSpectrumsByRoomId(ROOM_ID).toArray();

			expect(res).to.deep.equal([
				{
					_id: new ObjectId('000000000000000000000001'),
					room_id: '000000000000000000000001',
					player_id: '00000000000000000000000a',
					spectrum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					created_at: new Date('2020-01-01T10:00:00Z'),
					updated_at: new Date('2020-01-01T10:00:00Z'),
				},
				{
					_id: new ObjectId('000000000000000000000002'),
					room_id: '000000000000000000000001',
					player_id: '00000000000000000000000b',
					spectrum: [1, 1, 1, 1, 5, 6, 7, 7, 7, 7],
					created_at: new Date('2020-01-01T10:00:00Z'),
					updated_at: new Date('2020-01-01T10:00:00Z'),
				},
			]);
		});

		it('should apply the projection', async () => {
			const ROOM_ID = '000000000000000000000001'
			const res = await spectrumsModels.findSpectrumsByRoomId(
				ROOM_ID,
				{ _id: 0, player_id: 1, spectrum: 1 }
			).toArray();

			expect(res).to.deep.equal([
				{
					player_id: '00000000000000000000000a',
					spectrum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				},
				{
					player_id: '00000000000000000000000b',
					spectrum: [1, 1, 1, 1, 5, 6, 7, 7, 7, 7],
				},
			]);
		});

		it('should return an empty array if no spectrums is found', async () => {
			const ROOM_ID = 'ffffffffffffffffffffffff'
			const res = await spectrumsModels.findSpectrumsByRoomId(ROOM_ID).toArray();

			expect(res).to.deep.equal([]);
		});
	});

	describe('#insertOne()', () => {
		beforeEach(async () => {
			await spectrumsModels.collection().deleteMany({});
		});

		it('should insert one spectrum successfully', async () => {
			const FAKE_DATE = new Date("2000-01-01T10:00:00Z");
			const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

			const insertedSpectrum = await spectrumsModels.insertOne(fixtures.spectrum());

			const spectrumsFound = await spectrumsModels.find({}).toArray();

			const expectedSpectrum = {
				_id: insertedSpectrum._id,
				room_id: '000000000000000000000003',
				player_id: '00000000000000000000000d',
				spectrum: [7, 7, 7, 7, 7, 7, 7, 7, 7, 6],
				created_at: new Date("2000-01-01T10:00:00Z"),
				updated_at: new Date("2000-01-01T10:00:00Z"),
			};

			expect(dateStub.callCount).to.equal(2);
			expect(insertedSpectrum).to.deep.equal(expectedSpectrum);
			expect(spectrumsFound).to.deep.equal([expectedSpectrum]);
		});

		it('should throw and not insert an invalid spectrum (empty player id)', async () => {
			const invalidSpectrum = { ...fixtures.spectrum(), player_id: '' };

			let error;
			try {
				await spectrumsModels.insertOne(invalidSpectrum);
			} catch (err) {
				error = err;
			}

			expect(error)
				.to.be.instanceOf(Error)
				.with.property('message', '"player_id" is not allowed to be empty');

			const spectrumsFound = await spectrumsModels.find({}).toArray();
			expect(spectrumsFound).to.deep.equal([]);
		});

		it('should throw and not insert if the spectrum player id already exists for a same room', async () => {
			await spectrumsModels.insertOne(fixtures.spectrum());

			let error;
			try {
				await spectrumsModels.insertOne(fixtures.spectrum());
			} catch (err) {
				error = err;
			}

			expect(error).to.be.instanceOf(MongoError);
			expect(error.message).to.satisfy(msg =>
				msg.startsWith('E11000 duplicate key error collection')
			);

			const spectrumsFound = await spectrumsModels.find({}).toArray();
			expect(spectrumsFound.length).to.equal(1);
		});
	});

	describe('#updateOneSpectrum()', () => {
		beforeEach(async () => {
			await spectrumsModels.collection().insertMany(fixtures.default());
		});

		it('should update successfully a spectrum', async () => {
			const FAKE_DATE = new Date('2050-01-01T10:00:00Z');
			const dateStub = sandbox.stub(dateLib, 'newDate').returns(FAKE_DATE);

			const ROOM_ID = '000000000000000000000001';
			const PLAYER_ID = '00000000000000000000000a';
			const SPECTRUM = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
			const result = await spectrumsModels.updateOneSpectrum(
				ROOM_ID,
				PLAYER_ID,
				SPECTRUM,
			);

			const expectedSpectrums = [
				{
					_id: new ObjectId('000000000000000000000001'),
					room_id: '000000000000000000000001',
					player_id: '00000000000000000000000a',
					spectrum: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
					created_at: new Date("2020-01-01T10:00:00Z"),
					updated_at: new Date("2050-01-01T10:00:00Z")
				},
				{
					_id: new ObjectId('000000000000000000000002'),
					room_id: '000000000000000000000001',
					player_id: '00000000000000000000000b',
					spectrum: [1, 1, 1, 1, 5, 6, 7, 7, 7, 7],
					created_at: new Date('2020-01-01T10:00:00Z'),
					updated_at: new Date('2020-01-01T10:00:00Z'),
				}
			];
			const spectrumsFound = await spectrumsModels
				.findSpectrumsByRoomId(ROOM_ID)
				.toArray();

			expect(dateStub.callCount).to.equal(1);
			expect(result.modifiedCount).to.equal(1);
			expect(spectrumsFound).to.deep.equal(expectedSpectrums);
		});

		it('should not update anything if the spectrum does not exist', async () => {
			const ROOM_ID = '000000000000000000000001';
			const PLAYER_ID = 'ffffffffffffffffffffffff';
			const SPECTRUM = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
			const result = await spectrumsModels.updateOneSpectrum(
				ROOM_ID,
				PLAYER_ID,
				SPECTRUM,
			);

			expect(result.matchedCount).to.equal(0);
			expect(result.modifiedCount).to.equal(0);
		});
	});
});