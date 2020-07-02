'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const getPiecesLib = require('../../../../src/server/lib/pieces/getPieces');
const randomTetriminosLib = require('../../../../src/server/lib/pieces/randomPiece');
const roomsModels = require('../../../../src/server/models/rooms');

const fixtures = {
    ...require('../../../fixtures/tetriminos.fixtures.js'),
    ...require('../../../fixtures/rooms.fixtures.js'),
};

const { TETRIMINOS } = require('../../../../src/constants/tetriminos');

describe('lib/pieces/getPieces', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#__TESTS__._getAvailableTetriminos()', () => {
        it('should return an array of 2 available pieces and 0 pieces to create', async () => {
            const roomsFindStub = sandbox.stub(roomsModels, 'findOneById').resolves({
                blocks_list: fixtures.generateBlocksList(5),
            });

            const ROOM_ID = '000000000000000000000001';
            const PIECE_POSITION = 3;
            const NUMBER = 2;
            const pieces = await getPiecesLib._getAvailableTetriminos(
                ROOM_ID,
                PIECE_POSITION,
                NUMBER,
            );

            expect(roomsFindStub.args).to.deep.equal([
                ['000000000000000000000001', { _id: 0, blocks_list: 1 }],
            ]);
            expect(pieces).to.deep.equal({
                availablePieces: [
                    {
                        shape: [
                            [0, 'L', 0],
                            [0, 'L', 0],
                            [0, 'L', 'L'],
                        ],
                        color: TETRIMINOS.L.color,
                        rotationsPossible: 4,
                    },
                    {
                        shape: [
                            [0, 'S', 'S'],
                            ['S', 'S', 0],
                            [0, 0, 0],
                        ],
                        color: TETRIMINOS.S.color,
                        rotationsPossible: 2,
                    },
                ],
                piecesNumberToCreate: 0,
            });
        });

        it('should return an empty array if pieces are not created yet', async () => {
            const roomsFindStub = sandbox.stub(roomsModels, 'findOneById').resolves({
                blocks_list: [],
            });

            const ROOM_ID = '000000000000000000000001';
            const PIECE_POSITION = 3;
            const NUMBER = 2;
            const pieces = await getPiecesLib._getAvailableTetriminos(
                ROOM_ID,
                PIECE_POSITION,
                NUMBER,
            );

            expect(roomsFindStub.args).to.deep.equal([
                ['000000000000000000000001', { _id: 0, blocks_list: 1 }],
            ]);
            expect(pieces).to.deep.equal({
                availablePieces: [],
                piecesNumberToCreate: 5,
            });
        });
    });

    describe('#createNewRandomTetriminos()', () => {
        it('should create one new random tetrimino and update the collection', async () => {
            const randomTetriminoStub = sandbox
                .stub(randomTetriminosLib, 'getRandomTetrimino')
                .returns(fixtures.tetriminos().O);
            const updateBlocksListStub = sandbox.stub(roomsModels, 'updateRoomBlockList').resolves({
                matchedCount: 1,
                modifiedCound: 1,
            });

            const ROOM_ID = '000000000000000000000001';
            const numberToCreate = 1;
            const res = await getPiecesLib.createNewRandomTetriminos(ROOM_ID, numberToCreate);

            expect(randomTetriminoStub.callCount).to.equal(1);
            expect(updateBlocksListStub.args).to.deep.equal([
                [
                    '000000000000000000000001',
                    [
                        {
                            shape: [
                                ['O', 'O'],
                                ['O', 'O'],
                            ],
                            color: TETRIMINOS.O.color,
                            rotationsPossible: 1,
                        },
                    ],
                ],
            ]);
            expect(res).to.deep.equal({
                matchedCount: 1,
                modifiedCound: 1,
                blocksList: [
                    {
                        shape: [
                            ['O', 'O'],
                            ['O', 'O'],
                        ],
                        color: TETRIMINOS.O.color,
                        rotationsPossible: 1,
                    },
                ],
            });
        });

        it('should create one new random tetrimino and not update the collection if the roomId is null', async () => {
            const randomTetriminoStub = sandbox
                .stub(randomTetriminosLib, 'getRandomTetrimino')
                .returns(fixtures.tetriminos().O);

            const NULL_ROOM_ID = null;
            const numberToCreate = 1;
            const res = await getPiecesLib.createNewRandomTetriminos(NULL_ROOM_ID, numberToCreate);

            expect(randomTetriminoStub.callCount).to.equal(1);
            expect(res).to.deep.equal([
                {
                    shape: [
                        ['O', 'O'],
                        ['O', 'O'],
                    ],
                    color: TETRIMINOS.O.color,
                    rotationsPossible: 1,
                },
            ]);
        });

        it('should return null if the number is negative', async () => {
            const ROOM_ID = '000000000000000000000001';
            const numberToCreate = -1;
            const res = await getPiecesLib.createNewRandomTetriminos(ROOM_ID, numberToCreate);

            expect(res).to.be.null;
        });

        it('should return null if the number equals zero', async () => {
            const ROOM_ID = '000000000000000000000001';
            const numberToCreate = 0;
            const res = await getPiecesLib.createNewRandomTetriminos(ROOM_ID, numberToCreate);

            expect(res).to.be.null;
        });
    });

    describe('#getTetriminos()', () => {
        it('should return a list of pieces get from available list', async () => {
            const getAvailablePiecesStub = sandbox
                .stub(getPiecesLib, '_getAvailableTetriminos')
                .resolves({
                    availablePieces: fixtures.generateBlocksList(2),
                    piecesNumberToCreate: 0,
                });
            const createNewPiecesStub = sandbox
                .stub(getPiecesLib, 'createNewRandomTetriminos')
                .rejects(new Error('should not be called'));

            const ROOM_ID = '000000000000000000000001';
            const PIECE_POSITION = 3;
            const NUMBER = 2;
            const pieces = await getPiecesLib.getTetriminos(ROOM_ID, PIECE_POSITION, NUMBER);

            expect(getAvailablePiecesStub.args).to.deep.equal([['000000000000000000000001', 3, 2]]);
            expect(createNewPiecesStub.callCount).to.equal(0);
            expect(pieces).to.deep.equal([
                {
                    shape: [
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                    ],
                    color: TETRIMINOS.I.color,
                    rotationsPossible: 2,
                },
                {
                    shape: [
                        ['O', 'O'],
                        ['O', 'O'],
                    ],

                    color: TETRIMINOS.O.color,
                    rotationsPossible: 1,
                },
            ]);
        });

        it('should return a list of pieces fully created', async () => {
            const getAvailablePiecesStub = sandbox
                .stub(getPiecesLib, '_getAvailableTetriminos')
                .onCall(0)
                .resolves({
                    availablePieces: [],
                    piecesNumberToCreate: 2,
                })
                .onCall(1)
                .resolves({
                    availablePieces: fixtures.generateBlocksList(2),
                    piecesNumberToCreate: 0,
                });
            const createNewPiecesStub = sandbox
                .stub(getPiecesLib, 'createNewRandomTetriminos')
                .resolves({ blocks_list: fixtures.generateBlocksList(2) });

            const ROOM_ID = '000000000000000000000001';
            const PIECE_POSITION = 3;
            const NUMBER = 2;
            const pieces = await getPiecesLib.getTetriminos(ROOM_ID, PIECE_POSITION, NUMBER);

            expect(getAvailablePiecesStub.args).to.deep.equal([
                ['000000000000000000000001', 3, 2],
                ['000000000000000000000001', 3, 2],
            ]);
            expect(createNewPiecesStub.args).to.deep.equal([['000000000000000000000001', 2]]);
            expect(pieces).to.deep.equal([
                {
                    shape: [
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                    ],
                    color: TETRIMINOS.I.color,
                    rotationsPossible: 2,
                },
                {
                    shape: [
                        ['O', 'O'],
                        ['O', 'O'],
                    ],
                    color: TETRIMINOS.O.color,
                    rotationsPossible: 1,
                },
            ]);
        });

        it('should return a list of pieces half created', async () => {
            const getAvailablePiecesStub = sandbox
                .stub(getPiecesLib, '_getAvailableTetriminos')
                .onCall(0)
                .resolves({
                    availablePieces: fixtures.generateBlocksList(1),
                    piecesNumberToCreate: 1,
                })
                .onCall(1)
                .resolves({
                    availablePieces: fixtures.generateBlocksList(2),
                    piecesNumberToCreate: 0,
                });
            const createNewPiecesStub = sandbox
                .stub(getPiecesLib, 'createNewRandomTetriminos')
                .resolves({ blocks_list: fixtures.tetriminos().O });

            const ROOM_ID = '000000000000000000000001';
            const PIECE_POSITION = 3;
            const NUMBER = 2;
            const pieces = await getPiecesLib.getTetriminos(ROOM_ID, PIECE_POSITION, NUMBER);

            expect(getAvailablePiecesStub.args).to.deep.equal([
                ['000000000000000000000001', 3, 2],
                ['000000000000000000000001', 3, 2],
            ]);
            expect(createNewPiecesStub.args).to.deep.equal([['000000000000000000000001', 1]]);
            expect(pieces).to.deep.equal([
                {
                    shape: [
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                        [0, 'I', 0, 0],
                    ],
                    color: TETRIMINOS.I.color,
                    rotationsPossible: 2,
                },
                {
                    shape: [
                        ['O', 'O'],
                        ['O', 'O'],
                    ],
                    color: TETRIMINOS.O.color,
                    rotationsPossible: 1,
                },
            ]);
        });
    });
});
