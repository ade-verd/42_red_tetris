const { expect } = require('chai');
const { ObjectId } = require('mongodb');
const sinon = require('sinon');
const ioClient = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const ioInstance = require('../../../../../src/server/socket/ioInstance');
const config = require('../../../../../src/server/config');

const actionClient = require('../../../../../src/client/actions/game/status');
const statusHandler = require('../../../../../src/server/socket/handlers/status/status');
const playersLib = require('../../../../../src/server/models/players');
const roomsLib = require('../../../../../src/server/models/rooms');

const playersFixtures = require('../../../../fixtures/players.fixtures');
const roomsFixtures = require('../../../../fixtures/rooms.fixtures');

describe('socket/handlers/status/status', function() {
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

    describe('#handleGameOver event', function() {
        it('should call emitGameOver and emitGameWon', function(done) {
            const ROOM_ID = '000000000000000000000001';
            const PLAYER_ID = '00000000000000000000000a';
            const payload = actionClient.getStatusPayload(PLAYER_ID, ROOM_ID);

            let socket;
            const ioServer = ioInstance.get();
            ioServer.on('connection', _socket => {
                socket = _socket;
                client.emit('status:gameOver', payload);
            });

            const emitGameOverStub = sandbox
                .stub(statusHandler, 'emitGameOver')
                .callsFake(() => ioServer.emit('gameover:ok'));
            const emitGameWonStub = sandbox
                .stub(statusHandler, 'emitGameWon')
                .callsFake(() => ioServer.to(client.id).emit('gamewon:ok'));

            const client = ioClient.connect(socketUrl, options);

            client.once('gameover:ok', () => {
                expect(emitGameOverStub.args).to.deep.equal([
                    [
                        socket,
                        {
                            player_id: '00000000000000000000000a',
                            room_id: '000000000000000000000001',
                        },
                    ],
                ]);
                client.once('gamewon:ok', () => {
                    expect(emitGameWonStub.args).to.deep.equal([
                        [
                            socket,
                            {
                                player_id: '00000000000000000000000a',
                                room_id: '000000000000000000000001',
                            },
                        ],
                    ]);
                    client.disconnect();
                    done();
                });
            });
        });
    });

    describe('#isWinner()', function() {
        it('should return the winner object', async function() {
            const ROOM_ID = '000000000000000000000001';

            const findRoomStub = sandbox
                .stub(roomsLib, 'findOneById')
                .resolves(roomsFixtures.room3Players());
            const findPlayersStub = sandbox
                .stub(playersLib, 'findAllByIds')
                .resolves({ toArray: () => playersFixtures.playersWithWinner() });

            const ioServer = ioInstance.get();
            const winner = await statusHandler.isWinner({ io: ioServer, roomId: ROOM_ID });

            expect(findRoomStub.args).to.deep.equal([['000000000000000000000001', undefined]]);
            expect(findPlayersStub.args).to.deep.equal([
                [
                    [
                        '00000000000000000000000a',
                        '00000000000000000000000b',
                        '00000000000000000000000c',
                    ],
                ],
            ]);
            expect(winner).to.deep.equal({
                _id: new ObjectId('00000000000000000000000c'),
                socket_id: '0000000001',
                room_id: '000000000000000000000001',
                name: 'Jeffrey',
                blocks_consumed: 15,
                game_over: false,
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2020-01-01T10:00:00Z'),
            });
        });

        it('should return null if there is no winner', async function() {
            const ROOM_ID = '000000000000000000000001';

            const findRoomStub = sandbox
                .stub(roomsLib, 'findOneById')
                .resolves(roomsFixtures.room3Players());
            const findPlayersStub = sandbox
                .stub(playersLib, 'findAllByIds')
                .resolves({ toArray: () => playersFixtures.default() });

            const ioServer = ioInstance.get();
            const winner = await statusHandler.isWinner({ io: ioServer, roomId: ROOM_ID });

            expect(findRoomStub.args).to.deep.equal([['000000000000000000000001', undefined]]);
            expect(findPlayersStub.args).to.deep.equal([
                [
                    [
                        '00000000000000000000000a',
                        '00000000000000000000000b',
                        '00000000000000000000000c',
                    ],
                ],
            ]);
            expect(winner).to.be.null;
        });
    });

    describe('#emitGameWon()', function() {
        it('should update player on game over', async function() {
            const PLAYER_ID = '00000000000000000000000a';
            const ROOM_ID = '000000000000000000000001';
            const payload = actionClient.getStatusPayload(PLAYER_ID, ROOM_ID);

            const ioStub = sandbox.stub(ioInstance, 'get').returns('fakeIo');
            const updateStub = sandbox.stub(playersLib, 'updateOne').resolves();
            const isWinnerStub = sandbox.stub(statusHandler, 'isWinner').resolves(null);

            await statusHandler.emitGameWon({}, payload);

            expect(ioStub.args).to.deep.equal([[]]);
            expect(updateStub.args).to.deep.equal([
                ['00000000000000000000000a', { game_over: true }],
            ]);
            expect(isWinnerStub.args).to.deep.equal([[{ roomId: '000000000000000000000001' }]]);
        });

        it('should update player on game over and send the winner id to the room', function(done) {
            const PLAYER_ID = '00000000000000000000000a';
            const ROOM_ID = '000000000000000000000001';
            const payload = actionClient.getStatusPayload(PLAYER_ID, ROOM_ID);

            const updateStub = sandbox.stub(playersLib, 'updateOne').resolves();
            const isWinnerStub = sandbox
                .stub(statusHandler, 'isWinner')
                .resolves(playersFixtures.playersWithWinner()[2]);

            const ioServer = ioInstance.get();
            let connected = 0;
            ioServer.on('connection', socket => {
                socket.join(ROOM_ID);
                connected += 1;
                if (connected === CLIENTS.length) {
                    statusHandler.emitGameWon({}, payload);
                }
            });

            const CLIENTS = ['[ROOM] client0 (sender & receiver)', '[ROOM] client1 (receiver)'];
            const socketsClients = CLIENTS.map(() => ioClient.connect(socketUrl, options));

            let eventReceived = {};
            new Promise(resolve => {
                socketsClients.forEach((client, index) => {
                    client.on('status:gameWon:broadcast', payload => {
                        eventReceived = { ...eventReceived, ['client' + index]: payload };

                        if (Object.keys(eventReceived).length >= 2) resolve();
                    });
                });
            }).then(() => {
                expect(updateStub.args).to.deep.equal([
                    ['00000000000000000000000a', { game_over: true }],
                ]);
                expect(isWinnerStub.args).to.deep.equal([[{ roomId: '000000000000000000000001' }]]);
                expect(eventReceived).to.deep.equal({
                    client0: { winnerId: '00000000000000000000000c' },
                    client1: { winnerId: '00000000000000000000000c' },
                });
                socketsClients.forEach(client => {
                    client.disconnect();
                });
                done();
            });
        });

        it('should emit an error to the emitter', function(done) {
            const PLAYER_ID = '00000000000000000000000a';
            const ROOM_ID = '000000000000000000000001';
            const payload = actionClient.getStatusPayload(PLAYER_ID, ROOM_ID);

            const updateStub = sandbox
                .stub(playersLib, 'updateOne')
                .rejects(new Error('something happened'));

            let socket;
            const ioServer = ioInstance.get();
            ioServer.on('connection', _socket => {
                socket = _socket;
            });

            const client = ioClient.connect(socketUrl, options);
            client.once('connect', () => {
                statusHandler.emitGameWon(socket, payload);
            });

            client.once('status:gameWon:broadcast', payload => {
                expect(updateStub.args).to.deep.equal([
                    ['00000000000000000000000a', { game_over: true }],
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

    describe('#emitGameOver()', function() {
        it('should emit game over to the room', function(done) {
            const PLAYER_ID = '00000000000000000000000a';
            const ROOM_ID = '000000000000000000000001';
            const payload = actionClient.getStatusPayload(PLAYER_ID, ROOM_ID);

            let connected = 0;
            const ioServer = ioInstance.get();
            ioServer.on('connection', socket => {
                socket.join(ROOM_ID);
                connected += 1;
                if (connected === CLIENTS.length) {
                    statusHandler.emitGameOver(socket, payload);
                }
            });

            const CLIENTS = ['[ROOM] client0 (sender & receiver)', '[ROOM] client1 (receiver)'];
            const socketsClients = CLIENTS.map(() => ioClient.connect(socketUrl, options));

            let eventReceived = {};
            new Promise(resolve => {
                socketsClients.forEach((client, index) => {
                    client.on('status:gameOver:broadcast', payload => {
                        eventReceived = { ...eventReceived, ['client' + index]: payload };

                        if (Object.keys(eventReceived).length >= 2) resolve();
                    });
                });
            }).then(() => {
                const EXPECTED_PAYLOAD = {
                    room_id: '000000000000000000000001',
                    player_id: '00000000000000000000000a',
                };
                expect(eventReceived).to.deep.equal({
                    client0: EXPECTED_PAYLOAD,
                    client1: EXPECTED_PAYLOAD,
                });
                socketsClients.forEach(client => {
                    client.disconnect();
                });
                done();
            });
        });

        it('should emit an error to the emitter', function(done) {
            const PLAYER_ID = '00000000000000000000000a';
            const ROOM_ID = '000000000000000000000001';
            const payload = actionClient.getStatusPayload(PLAYER_ID, ROOM_ID);

            let socket;
            const ioServer = ioInstance.get();
            ioServer.on('connection', _socket => {
                socket = _socket;
            });

            sandbox.stub(ioInstance, 'get').returns(undefined);

            const client = ioClient.connect(socketUrl, options);
            client.once('connect', () => {
                statusHandler.emitGameOver(socket, payload);
            });

            client.once('status:gameOver:broadcast', payload => {
                expect(payload).to.deep.equal({
                    payload: {
                        room_id: '000000000000000000000001',
                        player_id: '00000000000000000000000a',
                    },
                    error: "TypeError: Cannot read property 'to' of undefined",
                });
                client.disconnect();
                done();
            });
        });
    });
});
