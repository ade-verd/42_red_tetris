'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const { getPlayersNames } = require('../../../../src/server/lib/rooms/roomPlayers');
const roomModels = require('../../../../src/server/models/rooms');
const playerModels = require('../../../../src/server/models//players');

const fixtures = require('../../../fixtures/rooms.fixtures');

describe('lib/rooms/roomPlayer', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#getPlayersNames()', () => {
        it('should return players names for a given room id', async () => {
            const fixture = roomModels.validate(fixtures.room3Players());
            const roomFindStub = sandbox.stub(roomModels, 'findOneById').resolves(fixture);
            const playerFindStub = sandbox.stub(playerModels, 'find').returns({
                toArray: () =>
                    Promise.resolve([
                        { _id: '00000000000000000000000a', name: 'AAA' },
                        { _id: '00000000000000000000000b', name: 'BBB' },
                        { _id: '00000000000000000000000c', name: 'CCC' },
                    ]),
            });

            const res = await getPlayersNames('000000000000000000000001');

            expect(roomFindStub.args).to.deep.equal([['000000000000000000000001']]);
            expect(playerFindStub.args).to.deep.equal([
                [
                    {
                        _id: {
                            $in: [
                                '00000000000000000000000a',
                                '00000000000000000000000b',
                                '00000000000000000000000c',
                            ],
                        },
                    },
                    { name: 1 },
                ],
            ]);
            expect(res).to.deep.equal([
                { _id: '00000000000000000000000a', name: 'AAA' },
                { _id: '00000000000000000000000b', name: 'BBB' },
                { _id: '00000000000000000000000c', name: 'CCC' },
            ]);
        });
    });
});
