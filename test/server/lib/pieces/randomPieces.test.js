'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const randomTetriminosLib = require('../../../../src/server/lib/pieces/randomPieces.js');
const randomLib = require('../../../../src/server/lib/utils/random');
const roomsModels = require('../../../../src/server/models/rooms');

const fixtures = require('../../../fixtures/tetriminos.fixtures.js');
describe('lib/pieces/randomPieces', () => {
	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	describe('#_getRandomRotation()', () => {
		it('should return the same tetrimino if there is only one rotation possible', () => {
			const res = randomTetriminosLib.__TESTS__._getRandomRotation(fixtures.tetriminos().O);

			expect(res).to.deep.equal({
				shape: [
					['O', 'O'],
					['O', 'O'],
				],
				color: '255, 239, 53',
				rotationsPossible: 1,
			});
		});

		it('should return the same tetrimino if the rotation 1 is randomly chosen', () => {
			const randomIntStub = sandbox.stub(randomLib, 'getRandomInt').returns(1);

			const res = randomTetriminosLib.__TESTS__._getRandomRotation(fixtures.tetriminos().J);

			expect(randomIntStub.callCount).to.equal(1);
			expect(res).to.deep.equal({
				shape: [
					[0, 'J', 0],
					[0, 'J', 0],
					['J', 'J', 0],
				],
				color: '34, 118, 185',
				rotationsPossible: 4,
			});
		});

		it('should return the rotated tetrimino if the rotation 3 is randomly chosen', () => {
			const randomIntStub = sandbox.stub(randomLib, 'getRandomInt').returns(3);

			const res = randomTetriminosLib.__TESTS__._getRandomRotation(fixtures.tetriminos().J);

			expect(randomIntStub.callCount).to.equal(1);
			expect(res).to.deep.equal({
				shape: [
					[0, 'J', 'J'],
					[0, 'J', 0],
					[0, 'J', 0],
				],
				color: '34, 118, 185',
				rotationsPossible: 4,
			});
		});
	});

	describe('#getRandomTetrimino()', () => {
		it('should return the same tetrimino if there is only one rotation possible', () => {
			const indexBlockO = fixtures.tetriminos().BLOCK_NAMES.indexOf('O');
			const randomIntStub = sandbox.stub(randomLib, 'getRandomInt').returns(indexBlockO);

			const randomTetrimino = randomTetriminosLib.getRandomTetrimino();

			expect(randomIntStub.callCount).to.equal(1);
			expect(randomTetrimino).to.deep.equal({
				shape: [
					['O', 'O'],
					['O', 'O'],
				],
				color: '255, 239, 53',
				rotationsPossible: 1,
			});
		});

		it('should return the rotated tetrimino', () => {
			const indexBlockO = fixtures.tetriminos().BLOCK_NAMES.indexOf('J');
			const randomIntStub = sandbox.stub(randomLib, 'getRandomInt');
			randomIntStub.onCall(0).returns(indexBlockO);
			randomIntStub.onCall(1).returns(2);

			const randomTetrimino = randomTetriminosLib.getRandomTetrimino();

			expect(randomIntStub.callCount).to.equal(2);
			expect(randomTetrimino).to.deep.equal({
				shape: [
					['J', 0, 0],
					['J', 'J', 'J'],
					[0, 0, 0],
				],
				color: '34, 118, 185',
				rotationsPossible: 4,
			});
		});
	});

	describe('#createNewRandomTetriminos()', () => {
		it('should create one new random tetrimino and update the collection', async () => {
			const randomTetriminoStub = sandbox
				.stub(randomTetriminosLib, 'getRandomTetrimino')
				.returns(fixtures.tetriminos().O);
			const updateBlocksListStub = sandbox.stub(roomsModels, 'updateRoomBlockList').resolves({
				matchedCount: 1,
				modifiedCound: 1,
			});

			const ROOM_ID = '000000000000000000000001';
			const numberToCreate = 1;
			const res = await randomTetriminosLib.createNewRandomTetriminos(ROOM_ID, numberToCreate);

			expect(randomTetriminoStub.callCount).to.equal(1);
			expect(updateBlocksListStub.args).to.deep.equal([[
				'000000000000000000000001',
				[{
					shape: [
						['O', 'O'],
						['O', 'O'],
					],
					color: '255, 239, 53',
					rotationsPossible: 1,
				}]
			]]);
			expect(res).to.deep.equal({
				matchedCount: 1,
				modifiedCound: 1,
				blockList: [{
					shape: [
						['O', 'O'],
						['O', 'O'],
					],
					color: '255, 239, 53',
					rotationsPossible: 1,
				}]
			});
		});
	})
});