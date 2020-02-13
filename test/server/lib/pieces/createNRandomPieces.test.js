'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const createNRandomPiecesLib = require('../../../../src/server/lib/pieces/createNRandomPieces.js');
const randomTetriminosLib = require('../../../../src/server/lib/pieces/randomPiece.js');
const roomsModels = require('../../../../src/server/models/rooms');

const fixtures = require('../../../fixtures/tetriminos.fixtures.js');
describe('lib/pieces/createNRandomPieces', () => {
	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
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
			const res = await createNRandomPiecesLib.createNewRandomTetriminos(ROOM_ID, numberToCreate);

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
	});
});