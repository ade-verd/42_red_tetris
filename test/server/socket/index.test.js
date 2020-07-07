const { expect } = require('chai');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../helpers/server');
const config = require('../../../src/server/config');

const eventHelpers = require('../../../src/server/socket/eventHelpers');
const { handlers } = require('../../../src/server/socket/index');

const roomsHandlers = require('../../../src/server/socket/handlers/rooms');
const playerSocketLib = require('../../../src/server/socket/lib/playersSocket/checkConnectedSocket');
const {
    checkConnectedSocket,
} = require('../../../src/server/socket/lib/playersSocket/checkConnectedSocket');

// describe.skip('socket/index.js', function() {
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
        const bindEventStub = sandbox.stub(eventHelpers, 'bindEvent');
        sandbox.stub(roomsHandlers, 'emitActiveRooms');

        const client = io.connect(socketUrl, options);

        client.on('server/start', () => {
            setTimeout(() => {
                expect(bindEventStub.callCount % handlers.length).to.equal(0);
                client.disconnect();
                done();
            }, 200);
        });
    });

    it('should call emitActiveRooms every x seconds', function(done) {
        sandbox.stub(config.rooms, 'refreshIntervalMs').value(50);
        sandbox.stub(eventHelpers, 'bindEvent');
        const emitActiveRoomsStub = sandbox.stub(roomsHandlers, 'emitActiveRooms').returns();
        // const checkSocketsStub = sandbox.stub(playerSocketLib, 'checkConnectedSocket');

        const client = io.connect(socketUrl, options);

        client.on('server/start', () => {
            setTimeout(() => {
                expect(emitActiveRoomsStub.callCount).to.be.at.least(2);
                // expect(checkSocketsStub.callCount).to.be.at.least(2);
                client.disconnect();
                done();
            }, 150);
        });
    });
});
