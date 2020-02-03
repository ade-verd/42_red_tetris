'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const randomLib = require('../../../../src/server/lib/utils/random.js');

describe('lib/utils/random', () => {
	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getRandomInt()', () => {
		it('should return the min number', async () => {
			const mathRandomStub = sandbox.stub(Math, 'random').returns(0);

			const [min, max] = [51, 100];
			const randomNumber = randomLib.getRandomInt(min, max);

			expect(mathRandomStub.callCount).to.equal(1);
			expect(randomNumber).to.equal(min);
		});

		it('should return the max number', async () => {
			const mathRandomStub = sandbox.stub(Math, 'random').returns(0.99);

			const [min, max] = [51, 100];
			const randomNumber = randomLib.getRandomInt(min, max);

			expect(mathRandomStub.callCount).to.equal(1);
			expect(randomNumber).to.equal(max);
		});

		it('should return exactly min where min equals max', async () => {
			const [min, max] = [100, 100];
			const randomNumber = randomLib.getRandomInt(min, max);

			expect(randomNumber).to.equal(100);
		});

		it('should return randomly a number between min (inclusive) and max (inclusive)', async () => {
			const [min, max] = [51, 100];
			const randomNumber = randomLib.getRandomInt(min, max);

			expect(randomNumber).to.be.within(min, max);
		});
	});
});