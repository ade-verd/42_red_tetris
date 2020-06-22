const { expect } = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');

const checkConnectedSocket = require('../../../../../src/server/socket/lib/playersSocket/checkConnectedSocket');

const getActiveRooms = require('../../../../../src/server/socket/handlers/rooms/getActiveRooms');
const playersModel = require('../../../../../src/server/models/players');
const roomInOut = require('../../../../../src/server/lib/rooms/roomInOut');

const playersFixtures = require('../../../../fixtures/players.fixtures');
const roomsFixtures = require('../../../../fixtures/rooms.fixtures');

const { GAME_STATUS } = require('../../../../../src/constants');

describe('socket/lib/playersSocket/checkConnectedSocket', async () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#_disconnectRoom()', async () => {
        it('should set offline a mongo room', async () => {
            const MONGO_ROOM_ID = '000000000000000000000001';

            const setOfflineStub = sandbox.stub(roomInOut, 'setOffline').resolves();
            const emitActiveRoomsStub = sandbox.stub(getActiveRooms, 'emitActiveRooms').resolves();

            await checkConnectedSocket._disconnectRoom(MONGO_ROOM_ID);

            expect(setOfflineStub.args).to.deep.equal([['000000000000000000000001']]);
            expect(emitActiveRoomsStub.args).to.deep.equal([[]]);
        });
    });

    describe('#_unsetPlayer()', async () => {
        it('should leave a mongo room', async () => {
            const MONGO_ROOM_ID = '000000000000000000000001';
            const PLAYER_ID = '00000000000000000000000a';

            const leaveStub = sandbox.stub(roomInOut, 'leave').resolves();

            await checkConnectedSocket._unsetPlayer(MONGO_ROOM_ID, PLAYER_ID);

            expect(leaveStub.args).to.deep.equal([
                ['000000000000000000000001', '00000000000000000000000a'],
            ]);
        });
    });

    describe('#_checkPlayers()', async () => {
        it('should check and disconnect players not connected anymore', async () => {
            const IO_ROOM = {
                sockets: {
                    '0000000001': true,
                },
            };
            const mongoRoom = roomsFixtures.default().slice(1, 2)[0];
            const mongoPlayers = playersFixtures.default().slice(0, 2);

            const findPlayersStub = sandbox.stub(playersModel, 'find').resolves(mongoPlayers);
            const unsetPlayerStub = sandbox.stub(checkConnectedSocket, '_unsetPlayer').resolves();

            await checkConnectedSocket._checkPlayers(IO_ROOM, mongoRoom);

            expect(findPlayersStub.args).to.deep.equal([
                [
                    {
                        _id: {
                            $in: [
                                new ObjectId('00000000000000000000000a'),
                                new ObjectId('00000000000000000000000b'),
                            ],
                        },
                    },
                    { socket_id: 1 },
                ],
            ]);
            expect(unsetPlayerStub.args).to.deep.equal([
                ['000000000000000000000002', '00000000000000000000000b'],
            ]);
        });
    });

    describe('#checkConnectedSocket()', async () => {
        const IO = {
            sockets: {
                adapter: {
                    rooms: {
                        '000000000000000000000001': { sockets: {} },
                    },
                },
            },
        };

        it('should check and disconnect players', async () => {
            const getRoomsStub = sandbox
                .stub(getActiveRooms, 'find')
                .resolves(roomsFixtures.default().slice(0, 1));
            const checkPlayersStub = sandbox.stub(checkConnectedSocket, '_checkPlayers').resolves();

            await checkConnectedSocket.checkConnectedSocket(IO);

            const expectedMongoRoom = {
                _id: new ObjectId('000000000000000000000001'),
                room_name: 'room_1',
                players_ids: ['00000000000000000000000a'],
                game_status: GAME_STATUS.WAITING,
                blocks_list: [],
                settings: {},
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2020-01-01T10:00:00Z'),
            };
            expect(getRoomsStub.args).to.deep.equal([[]]);
            expect(checkPlayersStub.args).to.deep.equal([[{ sockets: {} }, expectedMongoRoom]]);
        });

        it('should only set offline the room', async () => {
            const getRoomsStub = sandbox
                .stub(getActiveRooms, 'find')
                .resolves(roomsFixtures.default().slice(1, 2));
            const disconnectRoomStub = sandbox
                .stub(checkConnectedSocket, '_disconnectRoom')
                .resolves();

            await checkConnectedSocket.checkConnectedSocket(IO);

            expect(getRoomsStub.args).to.deep.equal([[]]);
            expect(disconnectRoomStub.args).to.deep.equal([['000000000000000000000002']]);
        });
    });
});
