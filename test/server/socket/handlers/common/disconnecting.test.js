const { expect } = require('chai');
const sinon = require('sinon');
const ioClient = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const ioServer = require('../../../../../src/server/socket/ioInstance');
const config = require('../../../../../src/server/config');

const disconnectRoomSocket = require('../../../../../src/server/socket/lib/roomSocket/disconnectRoomSocket');
const getActiveRooms = require('../../../../../src/server/socket/handlers/rooms/getActiveRooms');

// describe.skip('socket/handlers/common/disconnecting', function() {
describe('socket/handlers/common/disconnecting', function() {
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

    it('should disconnect while clicking on logout', function(done) {
        const disconnectStub = sandbox.stub(disconnectRoomSocket, 'disconnect').resolves();
        const getActiveRoomsStub = sandbox.stub(getActiveRooms, 'emitActiveRooms').resolves();

        let socket;
        const io = ioServer.get();
        io.on('connection', _socket => {
            socket = _socket;
        });

        const client = ioClient.connect(socketUrl, options);
        client.emit('log:out');

        setTimeout(() => {
            const socketRooms = Object.keys(socket.rooms);
            expect(disconnectStub.args).to.deep.equal([[socket, socketRooms]]);
            expect(getActiveRoomsStub.args).to.deep.equal([[socket]]);
            client.disconnect();
            done();
        }, 200);
    });

    it('should emit an error if something happened', function(done) {
        const err = new Error('something happened');
        const disconnectStub = sandbox.stub(disconnectRoomSocket, 'disconnect').rejects(err);
        const getActiveRoomsStub = sandbox.stub(getActiveRooms, 'emitActiveRooms').resolves();

        let socket;
        const io = ioServer.get();
        io.on('connection', _socket => {
            socket = _socket;
        });

        const client = ioClient.connect(socketUrl, options);
        client.emit('log:out');
        client.on('disconnected', payload => {
            expect(disconnectStub.args).to.deep.equal([[socket, [socket.client.id]]]);
            expect(getActiveRoomsStub.callCount).to.equal(0);
            expect(payload).to.deep.equal({
                socketRooms: [socket.client.id],
                error: 'Error: something happened',
            });
            client.disconnect();
            done();
        });
    });

    it('should disconnect if the socket connection is lost', function(done) {
        sandbox.stub(config.env, 'isTestEnv').value(false);
        const disconnectStub = sandbox.stub(disconnectRoomSocket, 'disconnect').resolves();
        const getActiveRoomsStub = sandbox.stub(getActiveRooms, 'emitActiveRooms').resolves();

        const io = ioServer.get();
        io.on('connection', socket => {
            socket.on('disconnecting', () => {
                setTimeout(() => {
                    expect(disconnectStub.callCount).to.equal(1);
                    expect(getActiveRoomsStub.callCount).to.equal(1);
                    // expect(disconnectStub.args).to.deep.equal([[socket, [socket.client.id]]]);
                    // expect(getActiveRoomsStub.args).to.deep.equal([[socket]]);
                    done();
                }, 100);
            });
        });

        const client = ioClient.connect(socketUrl, options);
        setTimeout(() => {
            client.disconnect();
        }, 100);
    });
});
