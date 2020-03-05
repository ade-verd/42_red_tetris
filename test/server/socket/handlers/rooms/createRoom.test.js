const { expect } = require('chai');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/rooms/createRoom');

const roomInOut = require('../../../../../src/server/lib/rooms/roomInOut.js');

const fixtures = require('../../../../fixtures/rooms.fixtures.js');

describe('socket/handlers/rooms/createRoom', function() {
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

    it('should emit the new room data', function(done) {
        const joinOrCreateStub = sandbox
            .stub(roomInOut, 'joinOrCreate')
            .resolves(fixtures.insertedRoom());

        const client = io.connect(socketUrl, options);

        client.emit('rooms:create', actionClient.createRoom('room_1', '00000000000000000000000a'));
        client.on('rooms:created', payload => {
            expect(joinOrCreateStub.args).to.deep.equal([['room_1', '00000000000000000000000a']]);
            expect(payload).to.deep.equal({
                room_id: '000000000000000000000004',
                room_name: 'room_1',
            });
            client.disconnect();
            done();
        });
    });

    it('should not emit anything if an error occurs while creating player', function(done) {
        const joinOrCreateStub = sandbox
            .stub(roomInOut, 'joinOrCreate')
            .rejects(new Error('something happened'));

        const client = io.connect(socketUrl, options);

        client.emit('rooms:create', actionClient.createRoom('room_1', '00000000000000000000000a'));
        client.on('rooms:created', payload => {
            expect(joinOrCreateStub.args).to.deep.equal([['room_1', '00000000000000000000000a']]);
            expect(payload).to.deep.equal({
                payload: {
                    room_name: 'room_1',
                    admin_id: '00000000000000000000000a',
                },
                error: 'Error: something happened',
            });
            client.disconnect();
            done();
        });
    });
});
