const { expect } = require('chai');
const sinon = require('sinon');
const ioClient = require('socket.io-client');

const ioInstance = require('../../../../../src/server/socket/ioInstance');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const changeRoomSocket = require('../../../../../src/server/socket/lib/roomSocket/changeRoomSocket');

describe('socket/lib/roomSocket/changeRoomSocket', function() {
    const sandbox = sinon.createSandbox();

    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        forceNew: true,
    };

    let server;
    beforeEach(cb => {
        startServer(config.server, function(err, srv) {
            server = srv;
            cb();
        });
    });

    afterEach(done => {
        server.stop(done);
        sandbox.restore();
    });

    it('should correctly move from a room to another one', function(done) {
        const FROM = 'LOBBY';
        const TO = 'ROOM1';

        const ioServer = ioInstance.get();
        ioServer.on('connection', socket => {
            socket.join(FROM, () => {
                changeRoomSocket.change(socket, TO);
            });
        });

        const client = ioClient.connect(socketUrl, options);

        const movements = {};
        client.once('rooms:socket:joined', payload => {
            expect(payload).to.deep.equal({ roomId: TO });
            movements.to = payload.roomId;
        });
        client.once('rooms:socket:left', payload => {
            expect(payload).to.deep.equal({ roomId: FROM });
            movements.from = payload.roomId;
        });

        setTimeout(() => {
            expect(movements).to.deep.equal({ from: FROM, to: TO });
            client.disconnect();
            done();
        }, 100);
    });

    it('should correctly join a room', function(done) {
        const FROM = 'LOBBY';
        const TO = 'ROOM1';

        const ioServer = ioInstance.get();
        ioServer.on('connection', socket => {
            changeRoomSocket.change(socket, TO);
        });

        const client = ioClient.connect(socketUrl, options);

        const movements = {};
        client.once('rooms:socket:joined', payload => {
            expect(payload).to.deep.equal({ roomId: TO });
            movements.to = payload.roomId;
        });
        client.once('rooms:socket:left', payload => {
            expect(payload).to.deep.equal({ roomId: FROM });
            movements.from = payload.roomId;
        });

        setTimeout(() => {
            expect(movements).to.deep.equal({ to: TO });
            client.disconnect();
            done();
        }, 100);
    });

    it('should correctly leave a room', function(done) {
        const FROM = 'LOBBY';
        const TO = 'ROOM1';

        const ioServer = ioInstance.get();
        ioServer.on('connection', socket => {
            socket.join(FROM, () => {
                changeRoomSocket.change(socket);
            });
        });

        const client = ioClient.connect(socketUrl, options);

        const movements = {};
        client.once('rooms:socket:joined', payload => {
            expect(payload).to.deep.equal({ roomId: TO });
            movements.to = payload.roomId;
        });
        client.once('rooms:socket:left', payload => {
            expect(payload).to.deep.equal({ roomId: FROM });
            movements.from = payload.roomId;
        });

        setTimeout(() => {
            expect(movements).to.deep.equal({ from: FROM });
            client.disconnect();
            done();
        }, 100);
    });
});
