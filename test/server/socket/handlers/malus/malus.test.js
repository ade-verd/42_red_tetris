const { expect } = require('chai');
const ioClt = require('socket.io-client');
const ioInstance = require('../../../../../src/server/socket/ioInstance');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/malus');

describe('socket/handlers/malus', function() {
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

    describe('socket/handlers/malus/malus', function() {
        let client1;
        let client2;
        beforeEach(() => {
            client1 = ioClt.connect(socketUrl, options);
            client2 = ioClt.connect(socketUrl, options);
        });

        afterEach(() => {
            client1.disconnect();
            client2.disconnect();
        });

        it('should emit malus', function(done) {
            const ROOM_ID = '000000000000000000000001';
            const MALUS = 2;
    
            client1.emit('malus:send', actionClient.getMalusPayload(ROOM_ID, MALUS));
            client2.once('malus:sent', payload => {
                expect(payload).to.deep.equal({
                    malus: MALUS,
                });
                done();
            });
        });
    
        it('should not emit if the payload is wrong', function(done) {
            const ROOM_ID = null;
            const MALUS = 2;
    
            client1.emit('malus:send', actionClient.getMalusPayload(ROOM_ID, MALUS));
            // Error will be sent back to client1
            client1.once('malus:sent', payload => {
                expect(payload.error).to.deep.equal('ValidationError: "room_id" must be a string');
                done();
            });
        });
    });

});
