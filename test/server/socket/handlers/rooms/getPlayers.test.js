const { expect } = require('chai');
const { ObjectId } = require('mongodb');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/rooms/getRoomPlayers.js');

const roomPlayers = require('../../../../../src/server/lib/rooms/roomPlayers.js');

describe('socket/handlers/rooms/getPlayers', function() {
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

    it('should emit the new players ids and names', function(done) {
        const ROOM_ID = '000000000000000000000001';
        const getPlayersNameStub = sandbox.stub(roomPlayers, 'getPlayersNames').resolves([
            { _id: new ObjectId('00000000000000000000000a'), name: 'AAA' },
            { _id: new ObjectId('00000000000000000000000b'), name: 'BBB' },
        ]);

        const client = io.connect(socketUrl, options);

        client.on('connect', () => {
            client.emit('rooms:players:get', actionClient.getRoomPlayersPayload(ROOM_ID));
        });
        client.once('rooms:players:got', payload => {
            expect(getPlayersNameStub.args).to.deep.equal([['000000000000000000000001']]);
            expect(payload).to.deep.equal({
                payload: { room_id: '000000000000000000000001' },
                players: [
                    { _id: '00000000000000000000000a', name: 'AAA' },
                    { _id: '00000000000000000000000b', name: 'BBB' },
                ],
            });
            client.disconnect();
            done();
        });
    });

    it('should not emit anything if an error occurs', function(done) {
        const getPlayersNameStub = sandbox
            .stub(roomPlayers, 'getPlayersNames')
            .rejects(new Error('something happened'));

        const ROOM_ID = '000000000000000000000001';

        const client = io.connect(socketUrl, options);

        client.on('connect', () => {
            client.emit('rooms:players:get', actionClient.getRoomPlayersPayload(ROOM_ID));
        });
        client.once('rooms:players:got', payload => {
            expect(getPlayersNameStub.args).to.deep.equal([['000000000000000000000001']]);
            expect(payload).to.deep.equal({
                payload: { room_id: '000000000000000000000001' },
                error: 'Error: something happened',
            });
            client.disconnect();
            done();
        });
    });
});
