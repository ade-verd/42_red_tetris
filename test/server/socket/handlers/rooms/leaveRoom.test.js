const { expect } = require('chai');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/rooms/leaveRoom.js');

const roomInOut = require('../../../../../src/server/lib/rooms/roomInOut.js');

describe('socket/handlers/rooms/leaveRoom', function() {
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

    it('should emit the new room data', function(done) {
        const ROOM_ID = '000000000000000000000001';
        const PLAYER_ID = '00000000000000000000000a';
        const leaveStub = sandbox.stub(roomInOut, 'leave').resolves({
            result: { n: 1, nModified: 1, ok: 1 },
        });

        const client = io.connect(socketUrl, options);

        client.on('connect', () => {
            client.emit('rooms:leave', actionClient.leaveRoomPayload(ROOM_ID, PLAYER_ID));
        });
        client.once('rooms:left', payload => {
            expect(leaveStub.args).to.deep.equal([
                ['000000000000000000000001', '00000000000000000000000a'],
            ]);
            expect(payload).to.deep.equal({
                payload: {
                    room_id: '000000000000000000000001',
                    player_id: '00000000000000000000000a',
                },
                update: { n: 1, nModified: 1, ok: 1 },
            });
            client.disconnect();
            done();
        });
    });

    it('should not emit anything if an error occurs while creating player', function(done) {
        const leaveStub = sandbox.stub(roomInOut, 'leave').rejects(new Error('something happened'));

        const ROOM_ID = '000000000000000000000001';
        const PLAYER_ID = '00000000000000000000000a';

        const client = io.connect(socketUrl, options);
        client.on('connect', () => {
            client.emit('rooms:leave', actionClient.leaveRoomPayload(ROOM_ID, PLAYER_ID));
        });
        client.once('rooms:left', payload => {
            expect(leaveStub.args).to.deep.equal([
                ['000000000000000000000001', '00000000000000000000000a'],
            ]);
            expect(payload).to.deep.equal({
                payload: {
                    room_id: '000000000000000000000001',
                    player_id: '00000000000000000000000a',
                },
                error: 'Error: something happened',
            });
            client.disconnect();
            done();
        });
    });
});
