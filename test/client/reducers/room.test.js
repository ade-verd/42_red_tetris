import { expect } from 'chai';
import sinon from 'sinon';

import { configureStore, fakeSocket } from '../../helpers/client';
import rootReducer from '../../../src/client/reducers';

import {
    dispatchReduceLeaveRoom,
    dispatchReduceRoomLeft,
} from '../../../src/client/actions/rooms/leaveRoom';
import { dispatchReduceRoomJoined } from '../../../src/client/actions/rooms/joinRoom';
import { dispatchReduceRoomCreated } from '../../../src/client/actions/rooms/createRoom';
import { dispatchReduceUpdateActiveRooms } from '../../../src/client/actions/rooms/getRoomPlayers';

import * as notify from '../../../src/client/actions/notifications';
import * as dateUtils from '../../../src/client/lib/utils/date';

import playersFixtures from '../../fixtures/players.fixtures';
import roomsFixtures from '../../fixtures/rooms.fixtures';
import { GAME_STATUS } from '../../../src/constants';

describe('client/reducers/room', function() {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sinon.stub(console, 'debug');
    });

    afterEach(() => {
        console.debug.restore();
        sandbox.restore();
    });

    describe('#handleRoomLeft() - ROOM_LEFT', function() {
        it('should return the state as it is and not notify any error', function(done) {
            const payload = {};

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {
                rms: {
                    rooms: [{ room_name: 'room_1' }],
                },
            };
            const store = configureStore(rootReducer, null, initialState, {
                ROOM_LEFT: ({ dispatch, getState }) => {
                    expect(notifyStub.callCount).to.equal(0);

                    const state = getState().rms;
                    expect(state).to.deep.equal({
                        rooms: [{ room_name: 'room_1' }],
                    });
                    done();
                },
            });

            dispatchReduceRoomLeft(store.dispatch, payload);
        });

        it('should return the state as it is and notify an error', function(done) {
            const payload = {
                error: 'Some error',
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {
                rms: {
                    rooms: [{ room_name: 'room_1' }],
                },
            };
            const store = configureStore(rootReducer, null, initialState, {
                ROOM_LEFT: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([[{ type: 'error', msg: 'Some error' }]]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({
                        rooms: [{ room_name: 'room_1' }],
                    });
                    done();
                },
            });

            dispatchReduceRoomLeft(store.dispatch, payload);
        });
    });

    describe('#handleRoomJoined() - ROOM_JOINED', function() {
        it('should return the state as it is and not notify any error', function(done) {
            const payload = {
                payload: {
                    room_id: '000000000000000000000004',
                },
                update: {
                    value: { room_name: 'room_1' },
                },
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                ROOM_JOINED: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            dispatchReduceRoomJoined(store.dispatch, payload);
        });

        it('should return the state as it is and notify an error', function(done) {
            const payload = {
                payload: {
                    room_id: '000000000000000000000004',
                },
                error: 'Error: Something happened',
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                ROOM_JOINED: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([
                        [{ type: 'error', msg: 'Error: Something happened' }],
                    ]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            dispatchReduceRoomJoined(store.dispatch, payload);
        });
    });

    describe('#handleRoomCreation() - ROOM_CREATED', function() {
        it('should return the state as it is and not notify any error', function(done) {
            const payload = {
                room_id: '000000000000000000000004',
                room_name: 'room_1',
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                ROOM_CREATED: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            dispatchReduceRoomCreated(store.dispatch, payload);
        });

        it('should return the state as it is and notify an error', function(done) {
            const payload = {
                error: 'Error: Something happened',
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                ROOM_CREATED: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([
                        [{ type: 'error', msg: 'Error: Something happened' }],
                    ]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            dispatchReduceRoomCreated(store.dispatch, payload);
        });
    });

    describe('#handleUpdateActiveRooms() - UPDATE_ACTIVE_ROOMS', function() {
        it('should save rooms and lobby payloads', function(done) {
            const payload = {
                rooms: [roomsFixtures.roomStringFields()],
                lobby: roomsFixtures.lobby(),
                error: undefined,
            };

            const dateStub = sandbox
                .stub(dateUtils, 'newDate')
                .returns(new Date('2020-01-01T10:00:00Z'));

            const initialState = {};
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    expect(dateStub.args).to.deep.equal([[]]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({
                        rooms: [
                            {
                                _id: '000000000000000000000004',
                                room_name: 'room_1',
                                players_ids: ['00000000000000000000000a'],
                                game_status: GAME_STATUS.WAITING,
                                blocks_list: [],
                                settings: {},
                                created_at: '2020-01-01T10:00:00Z',
                                updated_at: '2020-01-01T10:00:00Z',
                            },
                        ],
                        lobby: {
                            players_ids: [
                                '00000000000000000000000a',
                                '00000000000000000000000b',
                                '00000000000000000000000c',
                            ],
                        },
                        updatedAt: 1577872800000,
                    });
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });

        it('should check and update one player name (emit "players:player:get")', function(done) {
            const payload = {
                rooms: [],
                lobby: roomsFixtures.lobby(),
                error: undefined,
            };

            const dateStub = sandbox
                .stub(dateUtils, 'newDate')
                .returns(new Date('2020-01-01T10:00:00Z'));

            const initialState = {
                play: {
                    players: {
                        '00000000000000000000000a': 'Will',
                        '00000000000000000000000b': 'Carlton',
                    },
                },
            };
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    expect(dateStub.args).to.deep.equal([[]]);
                    expect(socket.emit.args).to.deep.equal([
                        ['players:player:get', { player_id: '00000000000000000000000c' }],
                    ]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({
                        rooms: [],
                        lobby: {
                            players_ids: [
                                '00000000000000000000000a',
                                '00000000000000000000000b',
                                '00000000000000000000000c',
                            ],
                        },
                        updatedAt: 1577872800000,
                    });
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });

        it("should check and update room's players names (emit 'rooms:players:get')", function(done) {
            const payload = {
                rooms: [roomsFixtures.roomStringFields()],
                lobby: { players_ids: [] },
                error: undefined,
            };

            const dateStub = sandbox
                .stub(dateUtils, 'newDate')
                .returns(new Date('2020-01-01T10:00:00Z'));

            const initialState = { play: { players: {} } };
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    expect(dateStub.args).to.deep.equal([[]]);
                    expect(socket.emit.args).to.deep.equal([
                        ['rooms:players:get', { room_id: '000000000000000000000004' }],
                    ]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({
                        rooms: [
                            {
                                _id: '000000000000000000000004',
                                room_name: 'room_1',
                                players_ids: ['00000000000000000000000a'],
                                game_status: GAME_STATUS.WAITING,
                                blocks_list: [],
                                settings: {},
                                created_at: '2020-01-01T10:00:00Z',
                                updated_at: '2020-01-01T10:00:00Z',
                            },
                        ],
                        lobby: { players_ids: [] },
                        updatedAt: 1577872800000,
                    });
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });

        it('should notify user if there is an error', function(done) {
            const payload = {
                error: 'Some error',
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([[{ type: 'error', msg: 'Some error' }]]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });

        it('should notify user if rooms are missing', function(done) {
            const payload = {
                lobby: { players_ids: [] },
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([
                        [{ type: 'error', msg: 'Error: invalid active rooms payload' }],
                    ]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });

        it('should notify user if lobby is missing', function(done) {
            const payload = {
                rooms: [roomsFixtures.roomStringFields()],
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([
                        [{ type: 'error', msg: 'Error: invalid active rooms payload' }],
                    ]);

                    const state = getState().rms;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });
    });
});
