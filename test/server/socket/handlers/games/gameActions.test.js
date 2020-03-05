const { expect } = require('chai');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/gameAction.js');

const gameActions = require('../../../../../src/server/lib/games/gameActions');
const roomsLib = require('../../../../../src/server/models/rooms');

const { GAME_STATUS, GAME_ACTIONS } = require('../../../../../src/constants');
describe('socket/handlers/games/gameActions', function() {
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

    it('should emit the response after game action call', function(done) {
        const pauseStub = sandbox
            .stub(gameActions, GAME_ACTIONS.PAUSE)
            .resolves({ modifiedCount: 1 });
        const findStub = sandbox
            .stub(roomsLib, 'findOneById')
            .resolves({ game_status: GAME_STATUS.PAUSE });

        const client = io.connect(socketUrl, options);

        const ROOM_ID = '000000000000000000000001';
        const ACTION = GAME_ACTIONS.PAUSE;
        client.emit('games:action:run', actionClient.gameActionPayload(ROOM_ID, ACTION));
        client.on('games:action:ran', payload => {
            expect(pauseStub.args).to.deep.equal([['000000000000000000000001']]);
            expect(findStub.args).to.deep.equal([
                ['000000000000000000000001', { _id: 0, game_status: 1 }],
            ]);
            expect(payload).to.deep.equal({
                payload: { room_id: '000000000000000000000001', action: GAME_ACTIONS.PAUSE },
                result: { modifiedCount: 1 },
                status: GAME_STATUS.PAUSE,
            });
            client.disconnect();
            done();
        });
    });

    it('should not emit anything if an error occurs while running action', function(done) {
        const pauseStub = sandbox
            .stub(gameActions, GAME_ACTIONS.PAUSE)
            .rejects(new Error('something happened'));

        const client = io.connect(socketUrl, options);

        const ROOM_ID = '000000000000000000000001';
        const ACTION = GAME_ACTIONS.PAUSE;
        client.emit('games:action:run', actionClient.gameActionPayload(ROOM_ID, ACTION));
        client.on('games:action:ran', payload => {
            expect(pauseStub.args).to.deep.equal([['000000000000000000000001']]);
            expect(payload).to.deep.equal({
                payload: { room_id: '000000000000000000000001', action: GAME_ACTIONS.PAUSE },
                error: 'Error: something happened',
            });
            client.disconnect();
            done();
        });
    });
});
