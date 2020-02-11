const Joi = require('@hapi/joi');
const { expect } = require('chai');
const sinon = require('sinon');
const ioClient = require('socket.io-client');

const { startServer } = require('../../../helpers/server');
const config = require('../../../../src/server/config');

const eventHelpers = require('../../../../src/server/socket/eventHelpers');

describe('Socket event helpers', function () {
	describe('#createEvent()', function () {
		it('should validate the schema and create an object event', () => {
			const EVENT_NAME = 'action';
			const RULES = {
				someString: Joi.string().required(),
				someNumber: Joi.number().min(0).required(),
			}
			const fn = () => 'some function';
			const eventResult = eventHelpers.createEvent(EVENT_NAME, RULES, fn);

			const expectedResult = {
				name: 'action',
				fn,
				validation: Joi.object({
					someString: Joi.string().required(),
					someNumber: Joi.number().min(0).required(),
				}),
			};
			expect(JSON.stringify(eventResult))
				.to.deep.equal(JSON.stringify(expectedResult));
		});

		it('should throw if the name is not truthy', () => {
			try {
				eventHelpers.createEvent(undefined, {}, () => {});
			} catch (err) {
				expect(err)
					.to.be.an.instanceOf(Error)
					.with.property('message', '[helpers] createEvent() must have a name');
			}
		});

		it('should throw if the third argument is not a function', () => {
			try {
				eventHelpers.createEvent('name', {}, 'not a function');
			} catch (err) {
				expect(err)
					.to.be.an.instanceOf(Error)
					.with.property('message', '[helpers] createEvent() must have a function');
			}
		});
	});

	describe.skip('#bindEvent()', function () {
		const socketUrl = config.server.url;
		const options = {
			// transports: ['websocket'],
			'force new connection': true
		};

		let server;
		before(cb => {
			startServer(config.server, function (err, srv) {
				server = srv;
				cb()
			})
		});

		after(done => {
			server.stop(done)
		});
		it('should bind event', function (done) {
			const client = ioClient.connect(socketUrl, options);

			const event = {
				name: 'should_bind_event',
				fakeFunction: sinon.fake.returns('42'),
				rules: {
					string: Joi.string().required(),
					number: Joi.number().min(0).required(),
				},
			};
			const eventCreated = eventHelpers.createEvent(
				event.name,
				event.rules,
				event.fakeFunction,
			);

			eventHelpers.bindEvent(client, eventCreated);
			client.emit('should_bind_event', { string: 'abdef', number: 1 }, function (error, message) {
				console.log(error);
				console.log(message);
			});
			setTimeout(() => {
				expect(event.fakeFunction.callCount).to.equal(1);
				expect(event.fakeFunction.args).to.deep.equal([[socket, { string: 'abdef', number: 1 }]]);
				client.disconnect();
				done();
			}, 200);
		});
	});
});