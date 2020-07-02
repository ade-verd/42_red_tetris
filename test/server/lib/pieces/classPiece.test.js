'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const Piece = require('../../../../src/server/lib/pieces/classPiece');
const randomLib = require('../../../../src/server/lib/utils/random');

const fixtures = require('../../../fixtures/tetriminos.fixtures.js');
const { TETRIMINOS } = require('../../../../src/constants/tetriminos');

describe('lib/pieces/classPiece', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#new Piece()', () => {
        it('should create a new random Piece', () => {
            const indexBlockO = fixtures.tetriminos().BLOCK_NAMES.indexOf('O');
            const randomIntStub = sandbox.stub(randomLib, 'getRandomInt').returns(indexBlockO);

            const randomPiece = new Piece().tetrimino();

            expect(randomIntStub.callCount).to.equal(1);
            expect(randomPiece).to.deep.equal({
                shape: [
                    ['O', 'O'],
                    ['O', 'O'],
                ],
                color: TETRIMINOS.O.color,
                rotationsPossible: 1,
            });
        });

        it('should return the shape only', () => {
            const indexBlockO = fixtures.tetriminos().BLOCK_NAMES.indexOf('O');
            const randomIntStub = sandbox.stub(randomLib, 'getRandomInt').returns(indexBlockO);

            const randomPieceShape = new Piece().shape();

            expect(randomIntStub.callCount).to.equal(1);
            expect(randomPieceShape).to.deep.equal([
                ['O', 'O'],
                ['O', 'O'],
            ]);
        });

        it('should return the color only', () => {
            const indexBlockO = fixtures.tetriminos().BLOCK_NAMES.indexOf('O');
            const randomIntStub = sandbox.stub(randomLib, 'getRandomInt').returns(indexBlockO);

            const randomPieceColor = new Piece().color();

            expect(randomIntStub.callCount).to.equal(1);
            expect(randomPieceColor).to.deep.equal(TETRIMINOS.O.color);
        });

        it('should create a new random Piece', async () => {
            const indexBlockO = fixtures.tetriminos().BLOCK_NAMES.indexOf('O');
            const randomIntStub = sandbox.stub(randomLib, 'getRandomInt').returns(indexBlockO);

            const randomPieceRotationsPossible = new Piece().rotationsPossible();

            expect(randomIntStub.callCount).to.equal(1);
            expect(randomPieceRotationsPossible).to.deep.equal(1);
        });
    });
});
