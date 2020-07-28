const { expect } = require('chai');
const sinon = require('sinon');
const ioClt = require('socket.io-client');
const ioInstance = require('../../../../../src/server/socket/ioInstance');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/status');
const playersLib = require('../../../../../src/server/models/players');
const fixtures = require('../../../../fixtures/players.fixtures');

describe('socket/handlers/status/status', function() {
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

    it('should receive gameOver and emit gameWon', function(done) {
        const ROOM_ID = '000000000000000000000001';
        const PLAYER_ID = '000000000000000000000002';
        const updateStub = sandbox.stub(playersLib, 'updateOne').resolves();
        
        client2.on('connect', () => {
            const findStub = sandbox.stub(playersLib, 'find').resolves({ toArray: () => fixtures.playersWithWinner(client2.id) });

            client1.emit(
                'status:gameOver',
                actionClient.getStatusPayload(PLAYER_ID, ROOM_ID),
            );

            client2.once('status:gameWon', payload => {
                expect(updateStub.args).to.deep.equal([[ PLAYER_ID, { game_over: true } ]]);
                expect(findStub.args).to.deep.equal([[{ room_id: ROOM_ID }]]);
                expect(payload).to.deep.equal(undefined);
                done();
            });
        });
    });

    it('should not emit anything if an error occurs while receiving gameOver', function(done) {
        const ROOM_ID = null;
        const PLAYER_ID = '000000000000000000000002';


        client1.emit(
            'status:gameOver',
            actionClient.getStatusPayload(PLAYER_ID, ROOM_ID),
        );
        // Error will be sent back to client1
        client1.once('status:gameWon', payload => {
            expect(payload.error).to.deep.equal('ValidationError: "room_id" must be a string');
            done();
        });
    });
});


describe.skip('socket/handlers/highscores/score', function() {
    console.log('score tests');
})
