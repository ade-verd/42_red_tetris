const { expect } = require('chai');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const playersLib = require('../../../../../src/server/models/players');

const fixtures = require('../../../../fixtures/players.fixtures.js');

describe('socket/handlers/players/getPlayers', function() {
    const sandbox = sinon.createSandbox();

    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        forceNew: true,
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

    it('should emit the player data', function(done) {
        const findStub = sandbox
            .stub(playersLib, 'findAllByIds')
            .resolves({ toArray: () => [fixtures.insertedPlayer()] });

        const client = io.connect(socketUrl, options);

        client.on('connect', () => {
            client.emit('players:players:get', { players_ids: ['00000000000000000000000d'] });
        });
        client.once('players:players:got', payload => {
            expect(findStub.args).to.deep.equal([[['00000000000000000000000d']]]);
            expect(payload).to.deep.equal({
                payload: { players_ids: ['00000000000000000000000d'] },
                players: [
                    {
                        _id: '00000000000000000000000d',
                        socket_id: '0000000004',
                        room_id: null,
                        name: 'Waldo',
                        game_over: false,
                        blocks_consumed: 0,
                        created_at: '2020-01-01T10:00:00.000Z',
                        updated_at: '2020-01-01T10:00:00.000Z',
                    },
                ],
            });
            client.disconnect();
            done();
        });
    });

    it('should not emit anything if an error occurs while getting the player', function(done) {
        const findStub = sandbox
            .stub(playersLib, 'findAllByIds')
            .rejects(new Error('something happened'));

        const client = io.connect(socketUrl, options);

        client.on('connect', () => {
            client.emit('players:players:get', { players_ids: ['00000000000000000000000d'] });
        });
        client.once('players:players:got', payload => {
            expect(findStub.args).to.deep.equal([[['00000000000000000000000d']]]);
            expect(payload).to.deep.equal({
                payload: { players_ids: ['00000000000000000000000d'] },
                error: 'Error: something happened',
            });
            client.disconnect();
            done();
        });
    });
});
