'use strict';

const { expect } = require('chai');
const { ObjectId } = require('mongodb');
const sinon = require('sinon');

const Room = require('../../../../src/server/lib/rooms/classRoom.js');
const roomsLib = require('../../../../src/server/models/rooms');
const getPieces = require('../../../../src/server/lib/pieces/getPieces');

const {
	GAME_STATUS,
	PIECES_NUMBER_AT_ROOM_CREATION
} = require('../../../../src/constants');
const fixtures = require('../../../fixtures/rooms.fixtures.js');

describe('lib/rooms/classRoom', () => {
	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	describe('#new Room()', () => {
		it('should create a new Room', async () => {
			const randomPiecesStub = sandbox
				.stub(getPieces, 'createNewRandomTetriminos')
				.resolves(fixtures.generateBlocksList(2));
			const insertStub = sandbox
				.stub(roomsLib, 'insertOne')
				.resolves(fixtures.insertedRoom());

			const room = await new Room('room_1', '00000000000000000000000a');

			const expectedBlocksList = [
				{
					shape: [
						[0, 'I', 0, 0],
						[0, 'I', 0, 0],
						[0, 'I', 0, 0],
						[0, 'I', 0, 0],
					],
					color: '29, 174, 236',
					rotationsPossible: 2,
				},
				{
					shape: [
						['O', 'O'],
						['O', 'O'],
					],
					color: '255, 239, 53',
					rotationsPossible: 1,
				}
			];
			expect(randomPiecesStub.args).to.deep.equal([[null, PIECES_NUMBER_AT_ROOM_CREATION]]);
			expect(insertStub.args).to.deep.equal([[{
				room_name: 'room_1',
				players_ids: ['00000000000000000000000a'],
				game_status: GAME_STATUS.WAITING,
				blocks_list: expectedBlocksList,
				settings: {},
			}]]);
			expect(room.id).to.equal('000000000000000000000004');
		});
	});

	describe('#find() method', () => {
		it('should find a room', async () => {
			const randomPiecesStub = sandbox
				.stub(getPieces, 'createNewRandomTetriminos')
				.resolves(fixtures.generateBlocksList(2));
			const insertStub = sandbox
				.stub(roomsLib, 'insertOne')
				.resolves(fixtures.insertedRoom());
			const findStub = sandbox
				.stub(roomsLib, 'findOneById')
				.resolves(fixtures.insertedRoom());

			const room = await new Room('room_1', '00000000000000000000000a');
			const foundRoom = await room.find();

			const expectedBlocksList = [
				{
					shape: [
						[0, 'I', 0, 0],
						[0, 'I', 0, 0],
						[0, 'I', 0, 0],
						[0, 'I', 0, 0],
					],
					color: '29, 174, 236',
					rotationsPossible: 2,
				}, {
					shape: [
						['O', 'O'],
						['O', 'O'],
					],
					color: '255, 239, 53',
					rotationsPossible: 1,
				}
			];
			expect(randomPiecesStub.args).to.deep.equal([[null, PIECES_NUMBER_AT_ROOM_CREATION]]);
			expect(insertStub.args).to.deep.equal([[{
				room_name: 'room_1',
				players_ids: ['00000000000000000000000a'],
				game_status: GAME_STATUS.WAITING,
				blocks_list: expectedBlocksList,
				settings: {},
			}]]);
			expect(findStub.args).to.deep.equal([
				['000000000000000000000004', undefined]
			]);
			expect(foundRoom).to.deep.equal({
				_id: new ObjectId('000000000000000000000004'),
				room_name: 'room_1',
				players_ids: ['00000000000000000000000a'],
				game_status: GAME_STATUS.WAITING,
				blocks_list: expectedBlocksList,
				settings: {},
				created_at: new Date('2020-01-01T10:00:00Z'),
				updated_at: new Date('2020-01-01T10:00:00Z'),
			});
		});
	});

	describe('#update() method', () => {
		it('should update a room', async () => {
			const randomPiecesStub = sandbox
				.stub(getPieces, 'createNewRandomTetriminos')
				.resolves(fixtures.generateBlocksList(2));
			const insertStub = sandbox
				.stub(roomsLib, 'insertOne')
				.resolves(fixtures.insertedRoom());
			const updateStub = sandbox
				.stub(roomsLib, 'updateOne')
			 	.resolves({ modifiedCount: 1 });

			const room = await new Room('room_1', '00000000000000000000000a');
			const updateResult = await room.update({ game_status: GAME_STATUS.PLAYING });

			const expectedBlocksList = [
				{
					shape: [
						[0, 'I', 0, 0],
						[0, 'I', 0, 0],
						[0, 'I', 0, 0],
						[0, 'I', 0, 0],
					],
					color: '29, 174, 236',
					rotationsPossible: 2,
				}, {
					shape: [
						['O', 'O'],
						['O', 'O'],
					],
					color: '255, 239, 53',
					rotationsPossible: 1,
				}
			];
			expect(randomPiecesStub.args).to.deep.equal([[null, PIECES_NUMBER_AT_ROOM_CREATION]]);
			expect(insertStub.args).to.deep.equal([[{
				room_name: 'room_1',
				players_ids: ['00000000000000000000000a'],
				game_status: GAME_STATUS.WAITING,
				blocks_list: expectedBlocksList,
				settings: {},
			}]]);
			expect(updateStub.args).to.deep.equal([
				['000000000000000000000004', { game_status: GAME_STATUS.PLAYING }],
			]);
			expect(updateResult).to.deep.equal({ modifiedCount: 1 });
		});
	});
});