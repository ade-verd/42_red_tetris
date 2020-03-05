const { expect } = require('chai');
const { ObjectId } = require('mongodb');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/players/createPlayer');

const playersLib = require('../../../../../src/server/models/players');

const fixtures = require('../../../../fixtures/players.fixtures.js');

describe('socket/handlers/players/createPlayer', function() {
    const sandbox = sinon.createSandbox();

    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        'force new connection': true,
    };

    let server;
    before(cb => {
        startServer(config.server, function(err, srv) {
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

    it('should emit the new player data', function(done) {
        const insertStub = sandbox
            .stub(playersLib, 'insertOne')
            .resolves(fixtures.insertedPlayer());
        const findStub = sandbox
            .stub(playersLib, 'findOneById')
            .resolves(fixtures.insertedPlayer());

        const client = io.connect(socketUrl, options);

        client.emit('players:create', actionClient.createPlayerPayload('Waldo'));
        client.on('players:created', payload => {
            expect(insertStub.args).to.deep.equal([[{ name: 'Waldo' }]]);
            expect(findStub.args).to.deep.equal([['00000000000000000000000d', undefined]]);
            expect(payload).to.deep.equal({
                payload: { name: 'Waldo' },
                player: {
                    _id: '00000000000000000000000d',
                    name: 'Waldo',
                    blocks_consumed: 0,
                    created_at: '2020-01-01T10:00:00.000Z',
                    updated_at: '2020-01-01T10:00:00.000Z',
                },
            });
            client.disconnect();
            done();
        });
    });

    it('should not emit anything if an error occurs while creating player', function(done) {
        const insertStub = sandbox
            .stub(playersLib, 'insertOne')
            .rejects(new Error('something happened'));

        const client = io.connect(socketUrl, options);

        client.emit('players:create', actionClient.createPlayerPayload('Waldo'));
        client.on('players:created', payload => {
            expect(insertStub.args).to.deep.equal([[{ name: 'Waldo' }]]);
            expect(payload).to.deep.equal({
                payload: {
                    name: 'Waldo',
                },
                error: 'Error: something happened',
            });
            client.disconnect();
            done();
        });
    });
});
