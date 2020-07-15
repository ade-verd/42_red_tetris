'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const dateLib = require('../../../../src/client/helpers/utils/date');

describe('helpers/utils/date', () => {
    describe('#newDate()', () => {
        let dateStub;

        beforeEach(() => {
            const FAKE_DATE = new Date('2020-01-01T10:00:00Z');
            dateStub = sinon.useFakeTimers(FAKE_DATE);
        });

        afterEach(() => {
            dateStub.restore();
        });

        it('should return the stubbed date if no argument is passed', async () => {
            const date = dateLib.newDate();

            expect(date).to.deep.equal(new Date('2020-01-01T10:00:00Z'));
        });

        it('should return the date passed as argument', async () => {
            const date = dateLib.newDate('2019-12-31T10:00:00Z');

            expect(date).to.deep.equal(new Date('2019-12-31T10:00:00Z'));
        });
    });

    describe('#timestampToDatetime()', () => {
        it('should return an object with date, hours, minutes, and seconds with leading zero', async () => {
            const date = dateLib.timestampToDatetime('2020-01-01T17:22:03Z');

            expect(date).to.deep.equal({
                date: new Date('2020-01-01T17:22:03Z'),
                h: '18',
                m: '22',
                s: '03',
            });
        });
    });
});
