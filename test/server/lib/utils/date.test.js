'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const dateLib = require('../../../../src/server/lib/utils/date');

describe('lib/utils/date', () => {
	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	describe('#newDate()', () => {
		it('should return the stubbed date if no argument is passed', async () => {
			const FAKE_DATE = new Date("2020-01-01T10:00:00Z");
			const newDateStub = sandbox.stub(Date, 'now').returns(FAKE_DATE);
			
			const date = dateLib.newDate();

			expect(newDateStub.args).to.deep.equal([[]]);
			expect(date).to.deep.equal(new Date("2020-01-01T10:00:00Z"));
		});

		it('should return the date passed as argument', async () => {
			const FAKE_DATE = new Date("2020-01-01T10:00:00Z");
			const newDateStub = sandbox.stub(Date, 'now').returns(FAKE_DATE);

			const date = dateLib.newDate("2019-12-31T10:00:00Z");

			expect(newDateStub.callCount).to.equal(0);
			expect(date).to.deep.equal(new Date("2019-12-31T10:00:00Z"));
		});
	});
});