const { expect } = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');

const playersModel = require('../../../../../src/server/models/players');
const getSocketByRoom = require('../../../../../src/server/socket/lib/roomSocket/getSocketByRoom');

const fixtures = require('../../../../fixtures/players.fixtures');

describe('socket/lib/roomSocket/getSocketByRoom', function() {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#getIoRoomPlayersIds()', async () => {
        it('should return a list of players ids for a given room socket', async () => {
            const ROOM_SOCKET_ID = '000000000000000000000001';
            const SOCKETS_IDS = { '0000000001': true, '0000000002': true };
            const IO = {
                sockets: {
                    adapter: {
                        rooms: {
                            [ROOM_SOCKET_ID]: { sockets: SOCKETS_IDS },
                        },
                    },
                },
            };

            const playerModelStub = sandbox
                .stub(playersModel, 'findAllBySocketIds')
                .resolves(fixtures.default().slice(0, 2));

            const res = await getSocketByRoom.getIoRoomPlayersIds(IO, ROOM_SOCKET_ID);

            expect(playerModelStub.args).to.deep.equal([[['0000000001', '0000000002'], {}]]);
            expect(res).to.deep.equal({
                players_ids: [
                    new ObjectId('00000000000000000000000a'),
                    new ObjectId('00000000000000000000000b'),
                ],
            });
        });

        it('should return an empty list of players ids for a given room socket', async () => {
            const ROOM_SOCKET_ID = '000000000000000000000001';
            const IO = {
                sockets: {
                    adapter: {
                        rooms: {},
                    },
                },
            };

            const playerModelStub = sandbox.stub(playersModel, 'findAllBySocketIds');

            const res = await getSocketByRoom.getIoRoomPlayersIds(IO, ROOM_SOCKET_ID);

            expect(playerModelStub.callCount).to.deep.equal(0);
            expect(res).to.deep.equal({
                players_ids: [],
            });
        });
    });
});
