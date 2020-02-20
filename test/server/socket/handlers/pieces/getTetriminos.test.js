const { expect } = require('chai');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/getTetriminos.js');

const getPiecesLib = require('../../../../../src/server/lib/pieces/getPieces');

const fixtures = {
    ...require('../../../../fixtures/tetriminos.fixtures.js'),
    ...require('../../../../fixtures/rooms.fixtures.js'),
};

describe('socket/handlers/pieces/getTetriminos', function() {
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

    it('should emit new randow pieces', function(done) {
        const getTetriminosStub = sandbox
            .stub(getPiecesLib, 'getTetriminos')
            .resolves(fixtures.generateBlocksList(1));

        const client = io.connect(socketUrl, options);

        const ROOM_ID = '000000000000000000000001';
        const PIECE_POSITION = 0;
        const NUMBER = 1;
        client.emit(
            'tetriminos:get_random',
            actionClient.getTetriminos(ROOM_ID, PIECE_POSITION, NUMBER),
        );
        client.on('tetriminos:get_random', payload => {
            expect(getTetriminosStub.args).to.deep.equal([['000000000000000000000001', 0, 1]]);
            expect(payload).to.deep.equal([
                {
                    shape: [
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                    ],
                    color: '29, 174, 236',
                    rotationsPossible: 2,
                },
            ]);
            client.disconnect();
            done();
        });
    });

    it('should not emit anything if an error occurs while getting pieces', function(done) {
        const getTetriminosStub = sandbox
            .stub(getPiecesLib, 'getTetriminos')
            .rejects(new Error('something happened'));

        const client = io.connect(socketUrl, options);

        const ROOM_ID = '000000000000000000000001';
        const PIECE_POSITION = 0;
        const NUMBER = 1;
        client.emit(
            'tetriminos:get_random',
            actionClient.getTetriminos(ROOM_ID, PIECE_POSITION, NUMBER),
        );
        client.on('tetriminos:get_random', payload => {
            expect(getTetriminosStub.args).to.deep.equal([['000000000000000000000001', 0, 1]]);
            expect(payload).to.deep.equal({ error: 'Error: something happened' });
            client.disconnect();
            done();
        });
    });
});
