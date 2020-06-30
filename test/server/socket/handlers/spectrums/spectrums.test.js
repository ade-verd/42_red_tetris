const { expect } = require('chai');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/spectrum');

describe('socket/handlers/spectrums/spectrums', function() {
    const sandbox = sinon.createSandbox();

    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        'force new connection': true,
    };

    let server;
    before(cb => {
        startServer(config.server, function(err, srv) {
            if (err) throw err;
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

    it('should emit new updated spectrum', function(done) {
        const client = io.connect(socketUrl, options);

        const ROOM_ID = '000000000000000000000001';
        const PLAYER_ID = '000000000000000000000002';
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

        client.emit(
            'spectrum:update',
            actionClient.getSpectrumPayload(ROOM_ID, PLAYER_ID, FIELD),
        );
        client.on('tetriminos:get_random', payload => {
            expect(payload).to.deep.equal({
                player_id: PLAYER_ID,
                spectrum: EXPECTED_SPECTRUM,
            });
            client.disconnect();
            done();
        });
    }).timeout(0);

    it('should not emit anything if an error occurs while updating spectrum', function(done) {
        const client = io.connect(socketUrl, options);

        const ROOM_ID = '000000000000000000000001';
        const PLAYER_ID = '000000000000000000000002';
        const FIELD = null;

        client.emit(
            'spectrum:update',
            actionClient.getSpectrumPayload(ROOM_ID, PLAYER_ID, FIELD),
        );
        client.on('tetriminos:get_random', payload => {
            expect(payload).to.deep.equal(null);
            client.disconnect();
            done();
        });
    }).timeout(0);
});
