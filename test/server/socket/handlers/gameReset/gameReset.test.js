const { expect } = require('chai');
const sinon = require('sinon');
const ioClt = require('socket.io-client');
const ioInstance = require('../../../../../src/server/socket/ioInstance');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/gameReset');

describe('socket/handlers/gameReset/gameReset', function() {
    const sandbox = sinon.createSandbox();


    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        'force new connection': true,
    };


    let server;
    let client1;
    let client2;
    before(async () => {
        await startServer(config.server, function(err, srv) {
            if (err) throw err;
            server = srv;
        });

        const ROOM_ID = '000000000000000000000001';

        const ioSrv = ioInstance.get();
        ioSrv.on('connection', socket => {
            socket.join(ROOM_ID);
        });

        client1 = ioClt.connect(socketUrl, options);
        client2 = ioClt.connect(socketUrl, options);
    });

    after(done => {
        server.stop();
        client1.disconnect();
        client2.disconnect();
        done();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should emit game reset', function(done) {
        const ROOM_ID = '000000000000000000000001';

        client1.emit(
            'game:reset',
            actionClient.getGameResetPayload(ROOM_ID),
        );
        client2.once('game:reseted', payload => {
            expect(payload).to.deep.equal(undefined);
            done();
        });
    });

    it('should not emit anything if an error occurs while reseting game', function(done) {
        const ROOM_ID = null;

        client1.emit(
            'game:reset',
            actionClient.getGameResetPayload(ROOM_ID),
        );
        // Error will be sent back to client1
        client1.once('game:reseted', payload => {
            expect(payload.error).to.deep.equal('ValidationError: "room_id" must be a string');
            done();
        });
    });
});
