'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const dateLib = require('../../../../src/server/lib/utils/date');

describe('lib/utils/date', () => {
	let dateStub;
	
	beforeEach(() => {
		const FAKE_DATE = new Date("2020-01-01T10:00:00Z");
		dateStub = sinon.useFakeTimers(FAKE_DATE);
	})

	afterEach(() => {
		dateStub.restore();
	});

	describe('#newDate()', () => {
		it('should return the stubbed date if no argument is passed', async () => {
			const date = dateLib.newDate();

			expect(date).to.deep.equal(new Date("2020-01-01T10:00:00Z"));
		});

		it('should return the date passed as argument', async () => {
			const date = dateLib.newDate("2019-12-31T10:00:00Z");

			expect(date).to.deep.equal(new Date("2019-12-31T10:00:00Z"));
		});
	});
});