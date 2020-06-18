const { expect } = require('chai');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../helpers/server');
const config = require('../../../src/server/config');

const eventHelpers = require('../../../src/server/socket/eventHelpers');
const { handlers } = require('../../../src/server/socket/index');

const roomsHandlers = require('../../../src/server/socket/handlers/rooms');
const playerSocketLib = require('../../../src/server/socket/lib/playersSocket/checkConnectedSocket');

describe('socket/index.js', function() {
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

    it('should bind event on connection', function(done) {
        const refreshIntervalStub = sandbox.stub(config.rooms, 'refreshIntervalMs').value(100);
        const bindEventStub = sandbox.stub(eventHelpers, 'bindEvent').returns(true);
        const emitActiveRoomsStub = sandbox.stub(roomsHandlers, 'emitActiveRooms').returns(true);
        // const checkSocketsStub = sandbox.stub(playerSocketLib, 'checkConnectedSocket').returns(true);

        const client = io.connect(socketUrl, options);

        client.on('server/start', () => {
            setTimeout(() => {
                expect(bindEventStub.callCount).to.equal(handlers.length);
                expect(emitActiveRoomsStub.callCount).to.equal(1);
                expect(emitActiveRoomsStub.args).to.deep.equal([[]]);
                // expect(checkSocketsStub.args).to.deep.equal([[]]);

                client.disconnect();
                done();
            }, 150);
        });
    });
});
