const { expect } = require('chai');
const { ObjectId } = require('mongodb');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/createRoom');

const roomsLib = require('../../../../../src/server/models/rooms');
const getPiecesLib = require('../../../../../src/server/lib/pieces/getPieces');

const {
	GAME_STATUS,
	PIECES_NUMBER_AT_ROOM_CREATION
} = require('../../../../../src/constants');
const fixtures = require('../../../../fixtures/rooms.fixtures.js');

describe("socket/handlers/rooms/createRoom", function () {
	const sandbox = sinon.createSandbox();

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

	afterEach(() => {
		sandbox.restore();
	});

	it('should emit the new room data', function (done) {
		const randomPiecesStub = sandbox
			.stub(getPiecesLib, 'createNewRandomTetriminos')
			.resolves(fixtures.generateBlocksList(2));
		const insertStub = sandbox
			.stub(roomsLib, 'insertOne')
			.resolves(fixtures.insertedRoom());

		const client = io.connect(socketUrl, options);
		
		client.emit(
			'rooms:create',
			actionClient.createRoom('room_1', '00000000000000000000000a'),
		);
		client.on('rooms:created', (payload) => {
			expect(randomPiecesStub.args).to.deep.equal([[null, PIECES_NUMBER_AT_ROOM_CREATION]]);
			expect(insertStub.args).to.deep.equal([[{
				room_name: 'room_1',
				players_ids: ['00000000000000000000000a'],
				game_status: GAME_STATUS.WAITING,
				blocks_list: [
					{
						shape: [
							[0, 'I', 0, 0],
							[0, 'I', 0, 0],
							[0, 'I', 0, 0],
							[0, 'I', 0, 0],
						],
						color: '29, 174, 236',
						rotationsPossible: 2,
					}, {
						shape: [
							['O', 'O'],
							['O', 'O'],
						],
						color: '255, 239, 53',
						rotationsPossible: 1,
					}
				],
				settings: {},
			}]]);
			expect(payload).to.deep.equal({
				room_id: '000000000000000000000004',
			});
			client.disconnect();
			done();
		});
	});

	it('should not emit anything if an error occurs while creating player', function (done) {
		const randomPiecesStub = sandbox
			.stub(getPiecesLib, 'createNewRandomTetriminos')
			.rejects(new Error('something happened'));

		const client = io.connect(socketUrl, options);

		client.emit(
			'rooms:create',
			actionClient.createRoom('room_1', '00000000000000000000000a'),
		);
		client.on('rooms:created', (payload) => {
			expect(randomPiecesStub.args).to.deep.equal([[null, PIECES_NUMBER_AT_ROOM_CREATION]]);
			console.log(payload);
			expect(payload).to.deep.equal({ error: 'Error: something happened' });
			client.disconnect();
			done();
		});
	});
});