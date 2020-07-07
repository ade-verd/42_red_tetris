const { expect } = require('chai');
const sinon = require('sinon');
const ioClt = require('socket.io-client');
const ioInstance = require('../../../../../src/server/socket/ioInstance');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/malus');

describe.skip('socket/handlers/malus/malus', function() {
    const sandbox = sinon.createSandbox();

    const ioSrv = ioInstance.get();
    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        'force new connection': true,
    };


    let server;
    let client1;
    let client2;
    before(cb => {
        startServer(config.server, function(err, srv) {
            if (err) throw err;
            server = srv;
            cb();
        });

        const ROOM_ID = '000000000000000000000001';
        
        ioSrv.on('connection', socket => {
            socket.join(ROOM_ID);
        });

        client1 = ioClt.connect(socketUrl, options);
        client2 = ioClt.connect(socketUrl, options);
    });

    after(done => {
        server.stop(done);
        client1.disconnect();
        client2.disconnect();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should emit malus', function(done) {
        const ROOM_ID = '000000000000000000000001';
        const MALUS = 2;

        client1.emit(
            'malus:send',
            actionClient.getGameStartPayload(ROOM_ID, MALUS)
        );
        client2.on('malus:sent', payload => {
            expect(payload).to.deep.equal({
                malus: MALUS
            });
            done();
        });
    });

    it('should not emit anything if an error occurs while sending malus', function(done) {
        const ROOM_ID = null;
        const PIECES = 2;

        client1.emit(
            'malus:send',
            actionClient.getGameStartPayload(ROOM_ID, MALUS),
        );
        client2.on('malus:sent', payload => {
            expect(payload).to.deep.equal(null);
            done();
        });
    });
});
