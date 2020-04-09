'use strict';

const { expect } = require('chai');
const { ObjectId } = require('mongodb');
const sinon = require('sinon');

const Room = require('../../../../src/server/lib/rooms/classRoom');
const roomInOut = require('../../../../src/server/lib/rooms/roomInOut');
const roomsLib = require('../../../../src/server/models/rooms');
const playersLib = require('../../../../src/server/models/players');

const { GAME_STATUS, MAX_PLAYERS } = require('../../../../src/constants');
const fixtures = require('../../../fixtures/rooms.fixtures.js');

describe('lib/rooms/classRoom', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#new Room()', () => {
        it('should join or create a new Room', async () => {
            const joinOrCreateStub = sandbox
                .stub(roomInOut, 'joinOrCreate')
                .resolves(fixtures.insertedRoom());

            const room = await new Room({
                roomName: 'room_1',
                roomCreaterId: '00000000000000000000000a',
            });

            expect(joinOrCreateStub.args).to.deep.equal([['room_1', '00000000000000000000000a']]);
            expect(room.id).to.equal('000000000000000000000004');
        });

        it('should not create a new Room and use an existing room id', async () => {
            const room = await new Room({
                roomId: '000000000000000000000004',
            });

            expect(room.id).to.equal('000000000000000000000004');
        });
    });

    describe('#find() method', () => {
        it('should find a room', async () => {
            const findStub = sandbox
                .stub(roomsLib, 'findOneById')
                .resolves(fixtures.insertedRoom());

            const room = await new Room({
                roomId: '000000000000000000000004',
            });
            const foundRoom = await room.find();

            expect(findStub.args).to.deep.equal([['000000000000000000000004', undefined]]);
            expect(foundRoom).to.deep.equal({
                _id: new ObjectId('000000000000000000000004'),
                room_name: 'room_1',
                players_ids: ['00000000000000000000000a'],
                game_status: GAME_STATUS.WAITING,
                blocks_list: fixtures.generateBlocksList(2),
                settings: {},
                created_at: new Date('2020-01-01T10:00:00Z'),
                updated_at: new Date('2020-01-01T10:00:00Z'),
            });
        });
    });

    describe('#update() method', () => {
        it('should update a room', async () => {
            const updateStub = sandbox.stub(roomsLib, 'updateOne').resolves({ modifiedCount: 1 });

            const room = await new Room({
                roomId: '000000000000000000000004',
            });
            const updateResult = await room.update({ game_status: GAME_STATUS.PLAYING });

            expect(updateStub.args).to.deep.equal([
                ['000000000000000000000004', { game_status: GAME_STATUS.PLAYING }],
            ]);
            expect(updateResult).to.deep.equal({ modifiedCount: 1 });
        });
    });

    describe('join() method', () => {
        it('should join a room', async () => {
            const expectedPlayersIds = ['00000000000000000000000a', '00000000000000000000000b'];
            const findStub = sandbox
                .stub(roomsLib, 'findOneById')
                .resolves(fixtures.insertedRoom());
            const updateJoinStub = sandbox.stub(roomsLib, 'updateJoinRoom').resolves({
                value: { ...fixtures.insertedRoom(), players_ids: expectedPlayersIds },
            });
            const updatePlayerStub = sandbox.stub(playersLib, 'updateOne').resolves({
                matchedCount: 1,
                modifiedCount: 1,
            });

            const room = await new Room({
                roomId: '000000000000000000000004',
            });
            const PLAYER_ID = '00000000000000000000000b';
            const updateResult = await room.join(PLAYER_ID);

            expect(findStub.args).to.deep.equal([
                ['000000000000000000000004', { _id: 0, players_ids: 1 }],
            ]);
            expect(updateJoinStub.args).to.deep.equal([
                ['000000000000000000000004', '00000000000000000000000b', undefined],
            ]);
            expect(updatePlayerStub.args).to.deep.equal([
                ['00000000000000000000000b', { room_id: '000000000000000000000004' }],
            ]);
            expect(updateResult.value).to.deep.equal({
                ...fixtures.insertedRoom(),
                players_ids: ['00000000000000000000000a', '00000000000000000000000b'],
            });
        });

        it('should throw if the room is full', async () => {
            const playersIds = number => {
                const array = [];
                for (let i = 0; i < number; i++) array.push(new ObjectId());
                return array;
            };
            const findStub = sandbox.stub(roomsLib, 'findOneById').resolves({
                ...fixtures.insertedRoom(),
                players_ids: playersIds(MAX_PLAYERS),
            });

            const room = await new Room({
                roomId: '000000000000000000000004',
            });
            const PLAYER_ID = '00000000000000000000000b';
            try {
                await room.join(PLAYER_ID);
            } catch (err) {
                expect(findStub.args).to.deep.equal([
                    ['000000000000000000000004', { _id: 0, players_ids: 1 }],
                ]);
                expect(err)
                    .to.be.an.instanceOf(Error)
                    .with.property(
                        'message',
                        `a room can not accept more than ${MAX_PLAYERS} players`,
                    );
            }
        });

        it('should throw if there is no modification', async () => {
            const findStub = sandbox
                .stub(roomsLib, 'findOneById')
                .resolves(fixtures.insertedRoom());
            const updateJoinStub = sandbox
                .stub(roomsLib, 'updateJoinRoom')
                .resolves({ value: null });

            const room = await new Room({
                roomId: '000000000000000000000004',
            });
            const PLAYER_ID = '00000000000000000000000b';

            try {
                await room.join(PLAYER_ID);
            } catch (err) {
                expect(findStub.args).to.deep.equal([
                    ['000000000000000000000004', { _id: 0, players_ids: 1 }],
                ]);
                expect(updateJoinStub.args).to.deep.equal([
                    ['000000000000000000000004', '00000000000000000000000b', undefined],
                ]);
                expect(err)
                    .to.be.an.instanceOf(Error)
                    .with.property('message', 'the room has not been updated');
            }
        });
    });

    describe('leave() method', () => {
        it('should leave a room', async () => {
            const updateLeaveStub = sandbox.stub(roomsLib, 'updateLeaveRoom').resolves({
                value: {
                    ...fixtures.insertedRoom(),
                    players_ids: ['00000000000000000000000b'],
                },
            });
            const findStub = sandbox
                .stub(roomsLib, 'findOneById')
                .resolves(fixtures.insertedRoom());
            const updateStatusStub = sandbox.stub(roomsLib, 'updateOne');
            const updatePlayerStub = sandbox.stub(playersLib, 'updateOne').resolves({
                matchedCount: 1,
                modifiedCount: 1,
            });

            const room = await new Room({
                roomId: '000000000000000000000004',
            });
            const PLAYER_ID = '00000000000000000000000a';
            const updateResult = await room.leave(PLAYER_ID);

            expect(updateLeaveStub.args).to.deep.equal([
                ['000000000000000000000004', '00000000000000000000000a'],
            ]);
            expect(findStub.args).to.deep.equal([
                ['000000000000000000000004', { _id: 0, players_ids: 1 }],
            ]);
            expect(updateStatusStub.args).to.deep.equal([]);
            expect(updateResult.value).to.deep.equal({
                ...fixtures.insertedRoom(),
                players_ids: ['00000000000000000000000b'],
            });
            expect(updatePlayerStub.args).to.deep.equal([
                ['00000000000000000000000a', { room_id: null }],
            ]);
        });

        it('should leave a room and set the game status to offline if there is no more players', async () => {
            const updateLeaveStub = sandbox.stub(roomsLib, 'updateLeaveRoom').resolves({
                value: {
                    ...fixtures.insertedRoom(),
                    players_ids: [],
                },
            });
            const findStub = sandbox
                .stub(roomsLib, 'findOneById')
                .resolves({ ...fixtures.insertedRoom(), players_ids: [] });
            const updateStatusStub = sandbox
                .stub(roomsLib, 'updateOne')
                .resolves({ modifiedCount: 1 });
            const updatePlayerStub = sandbox.stub(playersLib, 'updateOne').resolves({
                matchedCount: 1,
                modifiedCount: 1,
            });

            const room = await new Room({
                roomId: '000000000000000000000004',
            });
            const PLAYER_ID = '00000000000000000000000a';
            const updateResult = await room.leave(PLAYER_ID);

            expect(updateLeaveStub.args).to.deep.equal([
                ['000000000000000000000004', '00000000000000000000000a'],
            ]);
            expect(findStub.args).to.deep.equal([
                ['000000000000000000000004', { _id: 0, players_ids: 1 }],
            ]);
            expect(updateStatusStub.args).to.deep.equal([
                ['000000000000000000000004', { game_status: GAME_STATUS.OFFLINE }],
            ]);
            expect(updateResult.value).to.deep.equal({
                ...fixtures.insertedRoom(),
                players_ids: [],
            });
            expect(updatePlayerStub.args).to.deep.equal([
                ['00000000000000000000000a', { room_id: null }],
            ]);
        });

        it('should throw if there is no modification', async () => {
            const updateLeaveStub = sandbox.stub(roomsLib, 'updateLeaveRoom').resolves({
                value: null,
            });

            const room = await new Room({
                roomId: '000000000000000000000004',
            });
            const PLAYER_ID = '00000000000000000000000a';
            try {
                await room.leave(PLAYER_ID);
            } catch (err) {
                expect(updateLeaveStub.args).to.deep.equal([
                    ['000000000000000000000004', '00000000000000000000000a'],
                ]);
                expect(err)
                    .to.be.an.instanceOf(Error)
                    .with.property('message', 'the room has not been updated');
            }
        });
    });
});
