const { expect } = require('chai');
const sinon = require('sinon');
const ioClt = require('socket.io-client');
const ioInstance = require('../../../../../src/server/socket/ioInstance');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/spectrum');

describe.skip('socket/handlers/spectrums/spectrums', function() {
    const sandbox = sinon.createSandbox();

    const ioSrv = ioInstance.get();
    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        'force new connection': true,
    };

    console.log('TEST', ioSrv, ioInstance)

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

    it('should emit new updated spectrum', function(done) {
        const ROOM_ID = '000000000000000000000001';
        const PLAYER_ID = '000000000000000000000002';
        const PLAYER_NAME = 'PLAYER01'
        const FIELD = [
            [ [ 0, 'clear', false ], [ 0, 'clear', false ], [ 'l', 'merged', false ], [ 0, 'clear', false ] ],
            [ [ 0, 'clear', false ], [ 'l', 'merged', false ], [ 'l', 'merged', false ], [ 0, 'clear', false ] ],
            [ [ 0, 'clear', false ], [ 0, 'clear', false ], [ 0, 'clear', false ], [ 0, 'clear', false ] ],
            [ [ 0, 'clear', false ], [ 0, 'clear', false ], [ 0, 'clear', false ], [ 0, 'clear', false ] ],
        ];
        const EXPECTED_SPECTRUM = [
            [ 'clear', 'clear', 'merged', 'clear' ],
            [ 'clear', 'merged', 'merged', 'clear' ],
            [ 'clear', 'merged', 'merged', 'clear' ],
            [ 'clear', 'merged', 'merged', 'clear' ],
        ];

        client1.emit(
            'spectrum:update',
            actionClient.getSpectrumPayload(ROOM_ID, PLAYER_ID, PLAYER_NAME, FIELD),
        );
        client2.on('spectrum:updated', payload => {
            expect(payload).to.deep.equal({
                player_id: PLAYER_ID,
                player_name: PLAYER_NAME,
                spectrum: EXPECTED_SPECTRUM,
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
        client2.on('spectrum:updated', payload => {
            expect(payload).to.deep.equal(null);
            done();
        });
    });
});
