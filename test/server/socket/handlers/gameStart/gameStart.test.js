const { expect } = require('chai');
const ioClt = require('socket.io-client');
const ioInstance = require('../../../../../src/server/socket/ioInstance');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/gameStart');

describe('socket/handlers/gameStart/gameStart', function() {
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

    it('should emit game start', function(done) {
        const ROOM_ID = '000000000000000000000001';
        const PIECES = [
            {
                shape: [
                    [0, 0, 0, 0],
                    ['I', 'I', 'I', 'I'],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                color: '29, 174, 236',
                rotationsPossible: 2,
            },
            {
                shape: [
                    [0, 0, 'Z'],
                    [0, 'Z', 'Z'],
                    [0, 'Z', 0],
                ],
                color: '234, 32, 45',
                rotationsPossible: 2,
            },
        ];
        const INDEX = 0;
        const NEXT_TETROMINO = [
            [0, 0, 0, 0],
            ['I', 'I', 'I', 'I'],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];

        const PIECE = { pieces: PIECES, index: INDEX, tetromino: NEXT_TETROMINO };

        client1.emit(
            'game:start',
            actionClient.getGameStartPayload(ROOM_ID, PIECE),
        );
        client2.once('game:started', payload => {
            expect(payload).to.deep.equal({
                pieces: PIECES,
                index: INDEX,
                nextTetromino: NEXT_TETROMINO,
            });
            done();
        });
    });

    it('should not emit anything if an error occurs while starting game', function(done) {
        const ROOM_ID = '000000000000000000000001';
        const PIECES = null;
        const INDEX = 0;
        const NEXT_TETROMINO = null;

        const PIECE =  { pieces: PIECES, index: INDEX, tetromino: NEXT_TETROMINO };

        client1.emit(
            'game:start',
            actionClient.getGameStartPayload(ROOM_ID, PIECE),
        );
        // Error will be sent back to client1
        client1.once('game:started', payload => {
            expect(payload.error).to.deep.equal('ValidationError: "pieces" must be an array');
            done();
        });
    });
});
