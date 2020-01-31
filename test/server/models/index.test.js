'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const models = require('../../../src/server/models');

describe('models/index #createCollectionsIndexes()', () => {
	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it('should call createIndexes for each model', async () => {
		const highscoreStub = sandbox.stub(models.highscoresModels, 'createIndexes').resolves();
		const playersStub = sandbox.stub(models.playersModels, 'createIndexes').resolves();
		const roomsStub = sandbox.stub(models.roomsModels, 'createIndexes').resolves();
		const spectrumsStub = sandbox.stub(models.spectrumsModels, 'createIndexes').resolves();

		await models.createCollectionsIndexes();

		expect(highscoreStub.callCount).to.equal(1);
		expect(playersStub.callCount).to.equal(1);
		expect(roomsStub.callCount).to.equal(1);
		expect(spectrumsStub.callCount).to.equal(1);
	});
});