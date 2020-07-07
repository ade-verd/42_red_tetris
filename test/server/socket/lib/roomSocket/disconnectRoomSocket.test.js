const { expect } = require('chai');
const sinon = require('sinon');

const playersModel = require('../../../../../src/server/models/players');
const roomInOut = require('../../../../../src/server/lib/rooms/roomInOut');

const changeRoomSocket = require('../../../../../src/server/socket/lib/roomSocket/changeRoomSocket');
const disconnectRoomSocket = require('../../../../../src/server/socket/lib/roomSocket/disconnectRoomSocket');

const fixtures = {
    ...require('../../../../fixtures/players.fixtures'),
    ...require('../../../../fixtures/rooms.fixtures'),
};

describe('socket/lib/roomSocket/disconnectRoom', async () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#_unsetPlayerSocketId()', async () => {
        it('should update a player and set his socket id to null', async () => {
            const updateStub = sandbox
                .stub(playersModel, 'updateOne')
                .resolves({ modifiedCount: 1 });

            const PLAYER_ID = '00000000000000000000000a';

            await disconnectRoomSocket._unsetPlayerSocketId(PLAYER_ID);

            expect(updateStub.args).to.deep.equal([
                ['00000000000000000000000a', { socket_id: null }],
            ]);
        });
    });

    describe('#_leaveRooms()', async () => {
        it('should leave the mongo room and socket room', async () => {
            const SOCKET = 'fakeSocket';
            const PLAYER_ID = '00000000000000000000000a';
            const ROOMS_SOCKET = ['000000000000000000000001'];

            const roomLeaveStub = sandbox
                .stub(roomInOut, 'leave')
                .resolves({ value: { ...fixtures.insertedRoom(), players_ids: [] } });
            const changeRoomStub = sandbox.stub(changeRoomSocket, 'change');

            await disconnectRoomSocket._leaveRooms(SOCKET, ROOMS_SOCKET, PLAYER_ID);

            expect(roomLeaveStub.args).to.deep.equal([
                ['000000000000000000000001', '00000000000000000000000a'],
            ]);
            expect(changeRoomStub.args).to.deep.equal([[SOCKET, null]]);
        });

        it('should only leave the socket room', async () => {
            const SOCKET = 'fakeSocket';
            const PLAYER_ID = '00000000000000000000000a';
            const ROOMS_SOCKET = ['not_a_mongo_Object Id'];

            const roomLeaveStub = sandbox.stub(roomInOut, 'leave');
            const changeRoomStub = sandbox.stub(changeRoomSocket, 'change');

            await disconnectRoomSocket._leaveRooms(SOCKET, ROOMS_SOCKET, PLAYER_ID);

            expect(roomLeaveStub.args).to.deep.equal([]);
            expect(changeRoomStub.args).to.deep.equal([[SOCKET, null]]);
        });

        it('should not leave the socket room if the mongo room is not correctly updated', async () => {
            const SOCKET = 'fakeSocket';
            const PLAYER_ID = '00000000000000000000000a';
            const ROOMS_SOCKET = ['000000000000000000000001'];

            const roomLeaveStub = sandbox.stub(roomInOut, 'leave').resolves({});
            const changeRoomStub = sandbox.stub(changeRoomSocket, 'change');

            await disconnectRoomSocket._leaveRooms(SOCKET, ROOMS_SOCKET, PLAYER_ID);

            expect(roomLeaveStub.args).to.deep.equal([
                ['000000000000000000000001', '00000000000000000000000a'],
            ]);
            expect(changeRoomStub.args).to.deep.equal([]);
        });
    });

    describe('#disconnect()', async () => {
        it('should disconnect the player from socket and mongo rooms', async () => {
            const SOCKET = { client: { id: '0000000004' } };
            const ROOMS_SOCKET = ['0000000004', '000000000000000000000001'];

            const findStub = sandbox
                .stub(playersModel, 'findOneBySocketId')
                .resolves(fixtures.insertedPlayer());
            const _leaveRoomsStub = sandbox.stub(disconnectRoomSocket, '_leaveRooms').resolves();
            const _unsetPlayerSocketStub = sandbox
                .stub(disconnectRoomSocket, '_unsetPlayerSocketId')
                .resolves();

            await disconnectRoomSocket.disconnect(SOCKET, ROOMS_SOCKET);

            expect(findStub.args).to.deep.equal([['0000000004']]);
            expect(_leaveRoomsStub.args).to.deep.equal([
                [SOCKET, ['000000000000000000000001'], '00000000000000000000000d'],
            ]);
            expect(_unsetPlayerSocketStub.args).to.deep.equal([['00000000000000000000000d']]);
        });

        it('should do nothing if the socket id is not found in players collection', async () => {
            const SOCKET = { client: { id: '0000000004' } };
            const ROOMS_SOCKET = ['000000000000000000000001'];

            const findStub = sandbox.stub(playersModel, 'findOneBySocketId').resolves(null);

            await disconnectRoomSocket.disconnect(SOCKET, ROOMS_SOCKET);

            expect(findStub.args).to.deep.equal([['0000000004']]);
        });

        it('should do nothing if no socket rooms is joined', async () => {
            const SOCKET = { client: { id: '0000000004' } };
            const ROOMS_SOCKET = undefined;

            const findStub = sandbox.stub(playersModel, 'findOneBySocketId');

            await disconnectRoomSocket.disconnect(SOCKET, ROOMS_SOCKET);

            expect(findStub.args).to.deep.equal([]);
        });
    });
});
