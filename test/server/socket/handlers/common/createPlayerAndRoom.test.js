const { expect } = require('chai');
const sinon = require('sinon');
const ioClient = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const ioServer = require('../../../../../src/server/socket/ioInstance');
const config = require('../../../../../src/server/config');

const playerSocket = require('../../../../../src/server/socket/handlers/players/createPlayer');
const roomSocket = require('../../../../../src/server/socket/handlers/rooms/createRoom');
const getActiveRooms = require('../../../../../src/server/socket/handlers/rooms/getActiveRooms');
const playersModels = require('../../../../../src/server/models/players');
const roomInOut = require('../../../../../src/server/lib/rooms/roomInOut');

const fixtures = {
    ...require('../../../../fixtures/players.fixtures'),
    ...require('../../../../fixtures/rooms.fixtures'),
};

const clientAction = require('../../../../../src/client/actions/common/createPlayerAndRoom');

// describe.skip('socket/handlers/common/createPlayerAndRoom', function() {
// describe.only('socket/handlers/common/createPlayerAndRoom', function() {
describe('socket/handlers/common/createPlayerAndRoom', function() {
    const sandbox = sinon.createSandbox();

    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        forceNew: true,
    };

    let server;
    before(cb => {
        startServer(config.server, function(err, srv) {
            server = srv;
            cb();
        });
    });

    after(done => {
        server.stop(done);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should create a new player and a new room', function(done) {
        const createPlayerStub = sandbox
            .stub(playerSocket, 'createNewPlayer')
            .resolves(fixtures.insertedPlayer());
        const createRoomStub = sandbox
            .stub(roomInOut, 'joinOrCreate')
            .resolves(fixtures.insertedRoom());
        const getRoomsStub = sandbox.stub(getActiveRooms, 'emitActiveRooms');

        let socket;
        const io = ioServer.get();
        io.on('connection', _socket => {
            socket = _socket;
        });

        const payload = clientAction.createPlayerAndRoomPayload({
            playerName: 'Waldo',
            roomName: 'room_1',
        });

        const client = ioClient.connect(socketUrl, options);

        client.on('connect', () => {
            client.emit('players_rooms:create_join', payload);
        });

        client.once('rooms:created', payload => {
            expect(createPlayerStub.args).to.deep.equal([[socket, { name: 'Waldo' }]]);
            expect(createRoomStub.args).to.deep.equal([['room_1', '00000000000000000000000d']]);
            expect(getRoomsStub.args).to.deep.equal([[]]);
            expect(payload).to.deep.equal({
                room_id: '000000000000000000000004',
                room_name: 'room_1',
            });
            client.disconnect();
            done();
        });
    });

    it('should not try to create the room if an error occurs while creating the player', function(done) {
        const insertStub = sandbox.stub(playersModels, 'insertOne').rejects();
        const createRoomStub = sandbox.stub(roomSocket, 'createNewRoom');

        let socket;
        const io = ioServer.get();
        io.on('connection', _socket => {
            socket = _socket;
        });

        const payload = clientAction.createPlayerAndRoomPayload({
            playerName: 'Waldo',
            roomName: 'room_1',
        });

        const client = ioClient.connect(socketUrl, options);

        client.on('connect', () => {
            client.emit('players_rooms:create_join', payload);
        });
        client.once('players:created', () => {
            expect(insertStub.args).to.deep.equal([
                [{ socket_id: client.id, name: 'Waldo', room_id: null }],
            ]);
            expect(createRoomStub.args).to.deep.equal([]);
            client.disconnect();
            done();
        });
    });
});
