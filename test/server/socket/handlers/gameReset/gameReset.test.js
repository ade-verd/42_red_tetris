const { expect } = require('chai');
const sinon = require('sinon');
const ioClt = require('socket.io-client');
const ioInstance = require('../../../../../src/server/socket/ioInstance');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/gameReset');
const playersLib = require('../../../../../src/server/models/players');

describe('socket/handlers/gameReset', function() {
    const sandbox = sinon.createSandbox();

    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        forceNew: true,
    };

    let server;
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
    });

    after(done => {
        server.stop(done);
    });

    describe('socket/handlers/gameReset/gameReset', function() {
        let client1;
        let client2;
        beforeEach(done => {
            client1 = ioClt.connect(socketUrl, options);
            client2 = ioClt.connect(socketUrl, options);
            client1.on('connect', () => client2.on('connect', () => done()));
        });

        afterEach(() => {
            client1.disconnect();
            client2.disconnect();
            sandbox.restore();
        });

        it('should emit game reset', function(done) {
            const ROOM_ID = '000000000000000000000001';

            const updateManyStub = sandbox.stub(playersLib, 'updateMany').resolves();

            client1.emit('game:reset', actionClient.getGameResetPayload(ROOM_ID));
            client2.once('game:reseted', payload => {
                expect(updateManyStub.args).to.deep.equal([
                    [{ room_id: ROOM_ID }, { game_over: false }],
                ]);
                expect(payload).to.deep.equal(undefined);
                done();
            });
        });

        it('should not emit if database call rejects an error', function(done) {
            const ROOM_ID = '000000000000000000000001';

            const updateManyStub = sandbox
                .stub(playersLib, 'updateMany')
                .rejects(new Error('something happened'));

            client1.emit('game:reset', actionClient.getGameResetPayload(ROOM_ID));
            // Error will be sent back to client1
            client1.once('game:reseted', payload => {
                expect(updateManyStub.args).to.deep.equal([
                    [{ room_id: ROOM_ID }, { game_over: false }],
                ]);
                expect(payload).to.deep.equal({
                    payload: {
                        room_id: ROOM_ID,
                    },
                    error: 'Error: something happened',
                });
                done();
            });
        });

        it('should not emit if the payload is wrong', function(done) {
            const ROOM_ID = null;

            client1.emit('game:reset', actionClient.getGameResetPayload(ROOM_ID));
            // Error will be sent back to client1
            client1.once('game:reseted', payload => {
                expect(payload.error).to.deep.equal('ValidationError: "room_id" must be a string');
                done();
            });
        });
    });
});
