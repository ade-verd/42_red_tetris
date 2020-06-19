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

describe('socket/handlers/chat/broadcastMessages', function() {
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

    const MSG = {
        fromPlayerId: '000000000000000000000001',
        fromPlayerName: 'Bobby',
        toRoomId: 'LOBBY',
        message: "Hello, it's me: Bobby",
        date: 1577836800,
    };
    it('should broadcast the payload message to all clients in room, including sender', function(done) {
        const CLIENTS = [
            '[LOBBY] client0 (sender & receiver)',
            '[LOBBY] client1 (receiver)',
            '[OTHER_ROOM] client2 (not a receiver)',
        ];
        let roomSockets = [];

        const ioServer = ioInstance.get();
        ioServer.on('connection', socket => {
            if (roomSockets.length < 2) {
                socket.join(MSG.toRoomId);
                roomSockets.push(socket);
            }
        });

        const socketsClients = CLIENTS.map(client => ioClient.connect(socketUrl, options));

        socketsClients[0].emit(ON_EVENT, MSG);

        let messagesReceived = {};
        socketsClients.forEach((client, index) => {
            client.on(EMIT_EVENT, payload => {
                messagesReceived = { ...messagesReceived, ['client' + index]: payload };
            });
        });

        setTimeout(() => {
            expect(messagesReceived).to.deep.equal({
                client0: MSG,
                client1: MSG,
            });
            socketsClients.forEach(client => {
                client.disconnect();
            });
            done();
        }, 200);
    });

    it('should emit an error if something happened with io server', function(done) {
        const ioStub = sandbox.stub(ioInstance, 'get').returns(undefined);

        const client = ioClient.connect(socketUrl, options);

        client.emit(ON_EVENT, MSG);
        client.on(EMIT_EVENT, payload => {
            expect(ioStub.args).to.deep.equal([[]]);
            expect(payload).to.deep.equal({
                payload: MSG,
                error: "TypeError: Cannot read property 'in' of undefined",
            });
            client.disconnect();
            done();
        });
    });
});
