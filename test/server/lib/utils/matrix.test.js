'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const matrixLib = require('../../../../src/server/lib/utils/matrix');

const { TETRIMINOS } = require('../../../../src/constants/');

describe('lib/utils/matrix', () => {
	const sandbox = sinon.createSandbox();
	const IS_CLOCKWISE = true;
	const matrix = () => ([
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0],
	]);

	afterEach(() => {
		sandbox.restore();
	});

	describe('#rotateSquareMatrix()', () => {
		it('should rotate the matrix clockwise', async () => {
			const res = await matrixLib.rotateSquareMatrix(matrix(), IS_CLOCKWISE);

			expect(res).to.deep.equal([
				[1, 0, 0],
				[1, 1, 1],
				[0, 0, 0],
			]);
		});

		it('should rotate the matrix anti-clockwise', async () => {
			const res = await matrixLib.rotateSquareMatrix(matrix(), !IS_CLOCKWISE);

			expect(res).to.deep.equal([
				[0, 0, 0],
				[1, 1, 1],
				[0, 0, 1],
			]);
		});

		it('should rotate the matrix clockwise by default', async () => {
			const res = await matrixLib.rotateSquareMatrix(matrix());

			expect(res).to.deep.equal([
				[1, 0, 0],
				[1, 1, 1],
				[0, 0, 0],
			]);
		});
	});
});