const { expect } = require('chai');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/getTetriminos.js');

const getPiecesLib = require('../../../../../src/server/lib/pieces/getPieces');

const fixtures = {
    ...require('../../../../fixtures/tetriminos.fixtures.js'),
    ...require('../../../../fixtures/rooms.fixtures.js'),
};
const { TETRIMINOS } = require('../../../../../src/constants/tetriminos');

describe('socket/handlers/pieces/getTetriminos', function() {
    const sandbox = sinon.createSandbox();

    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        forceNew: true,
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

        const ROOM_ID = '000000000000000000000001';
        const PIECE_POSITION = 0;
        const NUMBER = 1;

        const client = io.connect(socketUrl, options);
        client.on('connect', () => {
            client.emit(
                'tetriminos:get_random',
                actionClient.getTetriminosPayload(ROOM_ID, PIECE_POSITION, NUMBER),
            );
        });
        client.once('tetriminos:get_random', payload => {
            expect(getTetriminosStub.args).to.deep.equal([['000000000000000000000001', 0, 1]]);
            expect(payload).to.deep.equal({
                payload: {
                    room_id: '000000000000000000000001',
                    pieces_position: 0,
                    number: 1,
                },
                pieces: [
                    {
                        shape: [
                            [0, 'I', 0, 0],
                            [0, 'I', 0, 0],
                            [0, 'I', 0, 0],
                            [0, 'I', 0, 0],
                        ],
                        color: TETRIMINOS.I.color,
                        rotationsPossible: 2,
                    },
                ],
            });
            client.disconnect();
            done();
        });
    });

    it('should not emit anything if an error occurs while getting pieces', function(done) {
        const getTetriminosStub = sandbox
            .stub(getPiecesLib, 'getTetriminos')
            .rejects(new Error('something happened'));

        const ROOM_ID = '000000000000000000000001';
        const PIECE_POSITION = 0;
        const NUMBER = 1;

        const client = io.connect(socketUrl, options);
        client.on('connect', () => {
            client.emit(
                'tetriminos:get_random',
                actionClient.getTetriminosPayload(ROOM_ID, PIECE_POSITION, NUMBER),
            );
        });
        client.once('tetriminos:get_random', payload => {
            expect(getTetriminosStub.args).to.deep.equal([['000000000000000000000001', 0, 1]]);
            expect(payload).to.deep.equal({
                payload: {
                    room_id: '000000000000000000000001',
                    pieces_position: 0,
                    number: 1,
                },
                error: 'Error: something happened',
            });
            client.disconnect();
            done();
        });
    });
});
