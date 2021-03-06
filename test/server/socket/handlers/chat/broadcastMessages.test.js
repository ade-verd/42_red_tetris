const { expect } = require('chai');
const sinon = require('sinon');
const ioClient = require('socket.io-client');

const ioInstance = require('../../../../../src/server/socket/ioInstance');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const {
    ON_EVENT,
    EMIT_EVENT,
} = require('../../../../../src/server/socket/handlers/chat/broadcastMessages');

const clientActions = require('../../../../../src/client/actions/chat/chat');

// describe.skip('socket/handlers/chat/broadcastMessages', function() {
describe('socket/handlers/chat/broadcastMessages', function() {
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

    it('should broadcast the payload message to all clients, including sender', function(done) {
        const msgPayload = clientActions.createChatPayload({
            playerId: '000000000000000000000001',
            playerName: 'Bobby',
            msg: "Hello, it's me: Bobby",
            roomId: 'lobby',
            date: 1577836800,
        });
        const EXPECTED_MSG = {
            fromPlayerId: '000000000000000000000001',
            fromPlayerName: 'Bobby',
            toRoomId: 'lobby',
            message: "Hello, it's me: Bobby",
            date: 1577836800,
        };
        const CLIENTS = [
            '[LOBBY] client0 (sender & receiver)',
            '[LOBBY] client1 (receiver)',
            '[]      client2 (receiver)',
        ];
        let roomSockets = [];
        let socketsClients = [];

        const ioServer = ioInstance.get();
        ioServer.on('connection', socket => {
            if (roomSockets.length < 2) {
                socket.join(msgPayload.toRoomId);
                roomSockets.push(socket);
            } else {
                socketsClients[0].emit(ON_EVENT, msgPayload);
            }
        });

        socketsClients = CLIENTS.map(() => ioClient.connect(socketUrl, options));

        let messagesReceived;
        socketsClients.forEach((client, index) => {
            client.on(EMIT_EVENT, payload => {
                messagesReceived = { ...messagesReceived, ['client' + index]: payload };
            });
        });

        setTimeout(() => {
            expect(messagesReceived).to.deep.equal({
                client0: EXPECTED_MSG,
                client1: EXPECTED_MSG,
                client2: EXPECTED_MSG,
            });
            socketsClients.forEach(client => {
                client.disconnect();
            });
            done();
        }, 200);
    });

    it('should broadcast the payload message to all clients in room, including sender', function(done) {
        const msgPayload = clientActions.createChatPayload({
            playerId: '000000000000000000000001',
            playerName: 'Bobby',
            roomId: '000000000000000000000001',
            msg: "Hello, it's me: Bobby",
            date: 1577836800,
        });
        const EXPECTED_MSG = {
            fromPlayerId: '000000000000000000000001',
            fromPlayerName: 'Bobby',
            toRoomId: '000000000000000000000001',
            message: "Hello, it's me: Bobby",
            date: 1577836800,
        };
        const CLIENTS = [
            '[LOBBY] client0 (sender & receiver)',
            '[LOBBY] client1 (receiver)',
            '[]      client2 (not a receiver)',
        ];
        let roomSockets = [];
        let socketsClients = [];

        const ioServer = ioInstance.get();
        ioServer.on('connection', socket => {
            if (roomSockets.length < 2) {
                socket.join(msgPayload.toRoomId);
                roomSockets.push(socket);
            } else {
                socketsClients[0].emit(ON_EVENT, msgPayload);
            }
        });

        socketsClients = CLIENTS.map(() => ioClient.connect(socketUrl, options));

        let messagesReceived;
        socketsClients.forEach((client, index) => {
            client.on(EMIT_EVENT, payload => {
                messagesReceived = { ...messagesReceived, ['client' + index]: payload };
            });
        });

        setTimeout(() => {
            expect(messagesReceived).to.deep.equal({
                client0: EXPECTED_MSG,
                client1: EXPECTED_MSG,
            });
            socketsClients.forEach(client => {
                client.disconnect();
            });
            done();
        }, 200);
    });

    it('should emit an error if something happened with io server', function(done) {
        const ioStub = sandbox.stub(ioInstance, 'get').returns(undefined);

        const msgPayload = clientActions.createChatPayload({
            playerId: '000000000000000000000001',
            playerName: 'Bobby',
            msg: "Hello, it's me: Bobby",
            roomId: '000000000000000000000001',
            date: 1577836800,
        });
        const EXPECTED_MSG = {
            fromPlayerId: '000000000000000000000001',
            fromPlayerName: 'Bobby',
            toRoomId: '000000000000000000000001',
            message: "Hello, it's me: Bobby",
            date: 1577836800,
        };

        const client = ioClient.connect(socketUrl, options);

        client.on('connect', () => {
            client.emit(ON_EVENT, msgPayload);
        });

        client.on(EMIT_EVENT, payload => {
            expect(ioStub.args).to.deep.equal([[]]);
            expect(payload).to.deep.equal({
                payload: EXPECTED_MSG,
                error: "TypeError: Cannot read property 'in' of undefined",
            });
            client.disconnect();
            done();
        });
    });
});
