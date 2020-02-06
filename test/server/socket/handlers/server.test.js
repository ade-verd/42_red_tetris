const { expect } = require('chai');
const io = require('socket.io-client');

const { startServer, configureStore } = require('../../../helpers/server');
const config = require('../../../../src/server/config');

const { ping } = require('../../../../src/client/actions/server');


describe("Server test", function () {
	const socketUrl = config.server.url;
	const options = {
		transports: ['websocket'],
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

	it('should pong after ping', function (done) {
		const client = io.connect(socketUrl, options);
		
		client.emit('action', ping());
		client.on('action', (payload) => {
			expect(payload).to.deep.equal({ type: 'pong' });
			client.disconnect();
			done();
		});
	});

	it('should not pong', function (done) {
		const client = io.connect(socketUrl, options);

		client.emit('action', { type: 'NOTping'});
		client.on('action', () => {
			throw new Error('should not be call')
		});
		setTimeout(() => done(), 50);
	});
});