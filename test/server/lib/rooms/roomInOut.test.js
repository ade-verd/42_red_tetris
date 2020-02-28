'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const Room = require('../../../../src/server/lib/rooms/classRoom.js');
const roomInOut = require('../../../../src/server/lib/rooms/roomInOut.js');
const roomsLib = require('../../../../src/server/models/rooms');
const getPieces = require('../../../../src/server/lib/pieces/getPieces');

const { GAME_STATUS, PIECES_NUMBER_AT_ROOM_CREATION } = require('../../../../src/constants');
const fixtures = require('../../../fixtures/rooms.fixtures.js');

describe('lib/rooms/roomInOut', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#joinOrCreate()', () => {
        it('should create a new Room', async () => {
            const findStub = sandbox.stub(roomsLib, 'findOneByName').resolves(null);
            const randomPiecesStub = sandbox
                .stub(getPieces, 'createNewRandomTetriminos')
                .resolves(fixtures.generateBlocksList(2));
            const insertStub = sandbox
                .stub(roomsLib, 'insertOne')
                .resolves(fixtures.insertedRoom());

            const room = await new Room({
                roomName: 'room_1',
                roomCreaterId: '00000000000000000000000a',
            });

            const expectedBlocksList = [
                {
                    shape: [
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                    ],
                    color: '29, 174, 236',
                    rotationsPossible: 2,
                },
                {
                    shape: [
                        ['O', 'O'],
                        ['O', 'O'],
                    ],
                    color: '255, 239, 53',
                    rotationsPossible: 1,
                },
            ];
            expect(findStub.args).to.deep.equal([['room_1']]);
            expect(randomPiecesStub.args).to.deep.equal([[null, PIECES_NUMBER_AT_ROOM_CREATION]]);
            expect(insertStub.args).to.deep.equal([
                [
                    {
                        room_name: 'room_1',
                        players_ids: ['00000000000000000000000a'],
                        game_status: GAME_STATUS.WAITING,
                        blocks_list: expectedBlocksList,
                        settings: {},
                    },
                ],
            ]);
            expect(room.id).to.equal('000000000000000000000004');
        });

        it('should join an existing "waiting" room', async () => {
            const findStub = sandbox
                .stub(roomsLib, 'findOneByName')
                .resolves(fixtures.insertedRoom());
            const joinStub = sandbox.stub(roomInOut, 'join').resolves({
                lastErrorObject: { n: 1, updatedExisting: true },
                value: {
                    ...fixtures.insertedRoom(),
                    players_ids: ['00000000000000000000000a', '00000000000000000000000b'],
                },
                ok: 1,
            });

            const ROOM_NAME = 'room_1';
            const PLAYER_ID = '00000000000000000000000b';
            const result = await roomInOut.joinOrCreate(ROOM_NAME, PLAYER_ID);

            expect(findStub.args).to.deep.equal([['room_1']]);
            expect(joinStub.args).to.deep.equal([
                ['000000000000000000000004', '00000000000000000000000b', {}],
            ]);
            expect(result).to.deep.equal({
                ...fixtures.insertedRoom(),
                players_ids: ['00000000000000000000000a', '00000000000000000000000b'],
            });
        });

        it('should join an existing "offline" room', async () => {
            const findStub = sandbox
                .stub(roomsLib, 'findOneByName')
                .resolves({ ...fixtures.insertedRoom(), game_status: GAME_STATUS.OFFLINE });
            const joinStub = sandbox.stub(roomInOut, 'join').resolves({
                lastErrorObject: { n: 1, updatedExisting: true },
                value: {
                    ...fixtures.insertedRoom(),
                    players_ids: ['00000000000000000000000a', '00000000000000000000000b'],
                    game_status: GAME_STATUS.WAITING,
                },
                ok: 1,
            });

            const ROOM_NAME = 'room_1';
            const PLAYER_ID = '00000000000000000000000b';
            const result = await roomInOut.joinOrCreate(ROOM_NAME, PLAYER_ID);

            expect(findStub.args).to.deep.equal([['room_1']]);
            expect(joinStub.args).to.deep.equal([
                [
                    '000000000000000000000004',
                    '00000000000000000000000b',
                    { game_status: GAME_STATUS.WAITING },
                ],
            ]);
            expect(result).to.deep.equal({
                ...fixtures.insertedRoom(),
                players_ids: ['00000000000000000000000a', '00000000000000000000000b'],
                game_status: GAME_STATUS.WAITING,
            });
        });
    });
});
