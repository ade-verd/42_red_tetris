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

    it('should emit highscores', function(done) {
        const HIGHSCORES = [
            {
                name: 'AAA',
                score: 333,
            },
            {
                name: 'BBB',
                score: 222,
            },
            {
                name: 'CCC',
                score: 111,
            },
        ];

        const findHighScoresStub = sandbox
            .stub(highscoresLib, 'findHighScores')
            .resolves(fixtures.getHighscoresOf3());

        client.emit('highscores:request');

        client.once('highscores:requested', payload => {
            expect(findHighScoresStub.args).to.deep.equal([[10]]);
            expect(payload.highscores).to.deep.equal(HIGHSCORES);
            done();
        });
    });

    it('should not emit anything if an error occurs while receiving gameOver', function(done) {
        const findHighScoresStub = sandbox
            .stub(highscoresLib, 'findHighScores')
            .rejects(new Error('something happened'));

        client.emit('highscores:request');

        client.once('highscores:requested', payload => {
            expect(findHighScoresStub.args).to.deep.equal([[10]]);
            expect(payload).to.deep.equal({
                payload: {},
                error: 'Error: something happened',
            });
            done();
        });
    });
});
