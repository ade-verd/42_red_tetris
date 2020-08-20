const { expect } = require('chai');
const sinon = require('sinon');
const ioClt = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/highscores/highscores');
const highscoresLib = require('../../../../../src/server/models/highscores');
const fixtures = require('../../../../fixtures/highscores.fixtures');

describe('socket/handlers/highscores', function() {
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
    });

    after(done => {
        server.stop(done);
    });

    let client;
    beforeEach(done => {
        client = ioClt.connect(socketUrl, options);
        client.on('connect', () => done());
    });

    afterEach(() => {
        client.disconnect();
        sandbox.restore();
    });

    it('should emit score', function(done) {
        const PLAYER_ID = '000000000000000000000001';
        const PLAYER_NAME = 'BOT';
        const SCORE = 42;

        const insertOneStub = sandbox.stub(highscoresLib, 'insertOne').resolves();

        client.emit('score:send', actionClient.getScorePayload(PLAYER_ID, PLAYER_NAME, SCORE));

        setTimeout(() => {
            expect(insertOneStub.args).to.deep.equal([
                [{ player_id: PLAYER_ID, player_name: PLAYER_NAME, score: SCORE }],
            ]);
            done();
        }, 100);
    });

    it('should emit the error if an error occurs while inserting score', function(done) {
        const PLAYER_ID = '000000000000000000000001';
        const PLAYER_NAME = 'BOT';
        const SCORE = 42;

        const insertOneStub = sandbox
            .stub(highscoresLib, 'insertOne')
            .rejects(new Error('something happened'));

        const scorePayload = () => actionClient.getScorePayload(PLAYER_ID, PLAYER_NAME, SCORE);
        client.emit('score:send', scorePayload());

        client.on('score:sent', payload => {
            expect(insertOneStub.args).to.deep.equal([
                [{ player_id: PLAYER_ID, player_name: PLAYER_NAME, score: SCORE }],
            ]);
            expect(payload).to.deep.equal({
                payload: scorePayload(),
                error: 'Error: something happened',
            });
            done();
        });
    });
});
