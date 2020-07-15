import { expect } from 'chai';
import sinon from 'sinon';

import { configureStore } from '../../helpers/client';
import rootReducer from '../../../src/client/reducers';

import { dispatchReducePlayerCreated } from '../../../src/client/actions/players/createPlayer';
import { updateStatePlayersNames } from '../../../src/client/actions/players/getPlayers';

import * as notify from '../../../src/client/actions/notifications';

import playersFixtures from '../../fixtures/players.fixtures';

describe('client/reducers/player', function() {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sinon.stub(console, 'debug');
    });

    afterEach(() => {
        console.debug.restore();
        sandbox.restore();
    });

    describe('#handlePlayerCreated() - PLAYER_CREATED', function() {
        it('should update state with the created player id and name', function(done) {
            const payload = {
                player: playersFixtures.playerStringFields(),
                error: undefined,
            };

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                PLAYER_CREATED: ({ dispatch, getState }) => {
                    const state = getState().play;
                    expect(state).to.deep.equal({
                        players: {
                            '00000000000000000000000d': 'Waldo',
                        },
                    });
                    done();
                },
            });

            dispatchReducePlayerCreated(store.dispatch, payload);
        });

        it('should return the state as it is and notify the player name is missing', function(done) {
            const payload = {
                error: 'ValidationError',
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                PLAYER_CREATED: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([
                        [{ type: 'warning', msg: 'Player name is missing' }],
                    ]);

                    const state = getState().play;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            dispatchReducePlayerCreated(store.dispatch, payload);
        });

        it('should return the state as it is and notify the user that an error occurred while creating the player', function(done) {
            const payload = {
                error: 'Other error',
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                PLAYER_CREATED: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([
                        [{ type: 'error', msg: 'Error while creating the player' }],
                    ]);

                    const state = getState().play;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            dispatchReducePlayerCreated(store.dispatch, payload);
        });
    });

    describe('#handleUpdatePlayersNames() - UPDATE_PLAYERS_NAMES', function() {
        it('should update the state with players id and name ', function(done) {
            const payload = {
                players: [playersFixtures.playerStringFields()],
                error: undefined,
            };

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                UPDATE_PLAYERS_NAMES: ({ dispatch, getState }) => {
                    const state = getState().play;
                    expect(state).to.deep.equal({
                        players: {
                            '00000000000000000000000d': 'Waldo',
                        },
                    });
                    done();
                },
            });

            updateStatePlayersNames(store.dispatch, payload);
        });

        it('should return the state as it is and notify the user that an error occurred', function(done) {
            const payload = {
                error: 'Error: Something happened',
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                UPDATE_PLAYERS_NAMES: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([
                        [{ type: 'error', msg: 'Error: Something happened' }],
                    ]);

                    const state = getState().play;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            updateStatePlayersNames(store.dispatch, payload);
        });
    });
});
