const { expect } = require('chai');
const sinon = require('sinon');
const ioClient = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const ioServer = require('../../../../../src/server/socket/ioInstance');
const config = require('../../../../../src/server/config');

const playerSocket = require('../../../../../src/server/socket/handlers/players/createPlayer');
const roomSocket = require('../../../../../src/server/socket/handlers/rooms/createRoom');

const fixtures = {
    ...require('../../../../fixtures/players.fixtures'),
    ...require('../../../../fixtures/rooms.fixtures'),
};

const clientAction = require('../../../../../src/client/actions/common/createPlayerAndRoom');

describe('socket/handlers/common/createPlayerAndRoom', function() {
    const sandbox = sinon.createSandbox();

    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        'force new connection': true,
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
            .stub(roomSocket, 'createNewRoom')
            .resolves(fixtures.insertedRoom());

        let socket;
        const io = ioServer.get();
        io.on('connection', _socket => {
            socket = _socket;
        });

        const client = ioClient.connect(socketUrl, options);

        const payload = clientAction.createPlayerAndRoomPayload({
            playerName: 'Waldo',
            roomName: 'room_1',
        });

        client.emit('players_rooms:create_join', payload);

        setTimeout(() => {
            expect(createPlayerStub.args).to.deep.equal([[socket, { name: payload.player_name }]]);
            expect(createRoomStub.args).to.deep.equal([
                [
                    socket,
                    {
                        room_name: payload.room_name,
                        admin_id: '00000000000000000000000d',
                    },
                ],
            ]);
            client.disconnect();
            done();
        }, 200);
    });

    it('should not try to create the room if an error occurs while creating the player', function(done) {
        const createPlayerStub = sandbox.stub(playerSocket, 'createNewPlayer').resolves(null);
        const createRoomStub = sandbox.stub(roomSocket, 'createNewRoom');

        let socket;
        const io = ioServer.get();
        io.on('connection', _socket => {
            socket = _socket;
        });

        const client = ioClient.connect(socketUrl, options);

        const payload = clientAction.createPlayerAndRoomPayload({
            playerName: 'Waldo',
            roomName: 'room_1',
        });

        client.emit('players_rooms:create_join', payload);

        setTimeout(() => {
            expect(createPlayerStub.args).to.deep.equal([[socket, { name: payload.player_name }]]);
            expect(createRoomStub.args).to.deep.equal([]);
            client.disconnect();
            done();
        }, 200);
    });
});
