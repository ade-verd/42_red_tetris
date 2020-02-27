const { expect } = require('chai');
const _ = require('lodash');
const sinon = require('sinon');
const io = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const config = require('../../../../../src/server/config');

const roomsLib = require('../../../../../src/server/models/rooms');

const { GAME_STATUS } = require('../../../../../src/constants');
const fixtures = require('../../../../fixtures/rooms.fixtures.js');

describe('socket/handlers/rooms/getActiveRooms', function() {
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

    it('should emit every active rooms', function(done) {
        const roomsFixtures = [fixtures.room1Player(), fixtures.room2Players()].map(room =>
            _.omit(room, 'blocks_list'),
        );
        const findStub = sandbox
            .stub(roomsLib, 'findRoomsByGameStatus')
            .resolves({ toArray: () => roomsFixtures });

        const client = io.connect(socketUrl, options);

        client.emit('rooms:get_active');
        client.on('rooms:got_active', payload => {
            const expectedRegex = `^(?!${GAME_STATUS.OFFLINE})`;
            const expectedProjection = {
                room_name: 1,
                players_ids: 1,
                game_status: 1,
                settings: 1,
            };
            expect(findStub.args).to.deep.equal([[expectedRegex, expectedProjection]]);
            expect(payload).to.deep.equal([
                {
                    room_name: 'room_4',
                    players_ids: ['00000000000000000000000a'],
                    game_status: GAME_STATUS.WAITING,
                    settings: {},
                },
                {
                    room_name: 'room_5',
                    players_ids: ['00000000000000000000000a', '00000000000000000000000b'],
                    game_status: GAME_STATUS.PLAYING,
                    settings: {},
                },
            ]);
            client.disconnect();
            done();
        });
    });

    it('should not emit anything if an error occurs while getting active rooms', function(done) {
        const findStub = sandbox
            .stub(roomsLib, 'findRoomsByGameStatus')
            .rejects(new Error('something happened'));

        const client = io.connect(socketUrl, options);

        client.emit('rooms:get_active');
        client.on('rooms:got_active', payload => {
            const expectedRegex = `^(?!${GAME_STATUS.OFFLINE})`;
            const expectedProjection = {
                room_name: 1,
                players_ids: 1,
                game_status: 1,
                settings: 1,
            };
            expect(findStub.args).to.deep.equal([[expectedRegex, expectedProjection]]);
            expect(payload).to.deep.equal({ error: 'Error: something happened' });
            client.disconnect();
            done();
        });
    });
});
