const { expect } = require('chai');
const sinon = require('sinon');
const ioClt = require('socket.io-client');
const ioInstance = require('../../../../../src/server/socket/ioInstance');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/status');

describe('socket/handlers/spectrums/spectrums', function() {
    const sandbox = sinon.createSandbox();

    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        forceNew: true,
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

    it('should emit new updated spectrum', function(done) {
        const ROOM_ID = '000000000000000000000001';
        const PLAYER_ID = '000000000000000000000002';
        const RESET = false;

        client1.emit(
            'status:gameOver',
            actionClient.getStatusPayload(ROOM_ID, PLAYER_ID, RESET),
        );
        client2.once('status:gameWon', payload => {
            expect(payload).to.deep.equal({
                room_id: ROOM_ID,
                player_id: PLAYER_ID,
                reset: RESET,
            });
            done();
        });
    });

    it('should not emit anything if an error occurs while updating spectrum', function(done) {
        const ROOM_ID = '000000000000000000000001';
        const PLAYER_ID = '000000000000000000000002';
        const PLAYER_NAME = 'PLAYER01';
        const FIELD = null;

        client1.emit(
            'spectrum:update',
            actionClient.getSpectrumPayload(ROOM_ID, PLAYER_ID, PLAYER_NAME, FIELD),
        );
        // Error will be sent back to client1
        client1.once('spectrum:updated', payload => {
            expect(payload.error).to.deep.equal('ValidationError: "field" must be an array');
            done();
        });
    });
});
