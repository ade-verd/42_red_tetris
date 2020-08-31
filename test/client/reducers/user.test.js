import { expect } from 'chai';
import sinon from 'sinon';

import { configureStore, fakeSocket } from '../../helpers/client';
import rootReducer from '../../../src/client/reducers';

import { updateStateAtLogout } from '../../../src/client/actions/players/logOut';
import { dispatchReducePlayerCreated } from '../../../src/client/actions/players/createPlayer';
import * as checkSocketId from '../../../src/client/actions/players/updateSocketId';
import { dispatchReduceLeaveRoom } from '../../../src/client/actions/rooms/leaveRoom';
import { dispatchReduceRoomJoined } from '../../../src/client/actions/rooms/joinRoom';
import { dispatchReduceRoomCreated } from '../../../src/client/actions/rooms/createRoom';
import { dispatchReduceUpdateActiveRooms } from '../../../src/client/actions/rooms/getRoomPlayers';

import * as notify from '../../../src/client/actions/notifications';

import playersFixtures from '../../fixtures/players.fixtures';
import roomsFixtures from '../../fixtures/rooms.fixtures';

describe('client/reducers/user', function() {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sinon.stub(console, 'debug');
    });

    afterEach(() => {
        console.debug.restore();
        sandbox.restore();
    });

    describe('#handleUserUpdate() - PLAYER_CREATED', function() {
        it('should update state after guest created player', function(done) {
            const payload = {
                player: playersFixtures.playerStringFields(),
                error: undefined,
            };

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                PLAYER_CREATED: ({ dispatch, getState }) => {
                    const state = getState().usr;
                    expect(state).to.deep.equal({
                        id: '00000000000000000000000d',
                        name: 'Waldo',
                        roomId: null,
                    });
                    done();
                },
            });

            dispatchReducePlayerCreated(store.dispatch, payload);
        });

        it('should update state with null fields if an error occurred while creating player', function(done) {
            const payload = {
                error: 'Error: Something happened',
            };

            const initialState = {};
            const store = configureStore(rootReducer, null, initialState, {
                PLAYER_CREATED: ({ dispatch, getState }) => {
                    const state = getState().usr;
                    expect(state).to.deep.equal({
                        id: null,
                        name: null,
                        roomId: null,
                    });
                    done();
                },
            });

            dispatchReducePlayerCreated(store.dispatch, payload);
        });
    });

    describe('#handleRoomUpdate() - LEAVE_ROOM / ROOM_JOINED / ROOM_CREATED', function() {
        describe('LEAVE_ROOM', function() {
            it('should update state after player left the room', function(done) {
                const initialState = {
                    usr: {
                        roomId: '000000000000000000000004',
                        roomName: 'room_1',
                    },
                };
                const store = configureStore(rootReducer, null, initialState, {
                    LEAVE_ROOM: ({ dispatch, getState }) => {
                        const state = getState().usr;
                        expect(state).to.deep.equal({
                            roomId: null,
                            roomName: null,
                        });
                        done();
                    },
                });

                dispatchReduceLeaveRoom(store);
            });
        });

        describe('ROOM_JOINED', function() {
            it('should update state after player joined the room', function(done) {
                const payload = {
                    payload: {
                        room_id: '000000000000000000000004',
                    },
                    update: {
                        value: { room_name: 'room_1' },
                    },
                };

                const initialState = {};
                const store = configureStore(rootReducer, null, initialState, {
                    ROOM_JOINED: ({ dispatch, getState }) => {
                        const state = getState().usr;
                        expect(state).to.deep.equal({
                            roomId: '000000000000000000000004',
                            roomName: 'room_1',
                        });
                        done();
                    },
                });

                dispatchReduceRoomJoined(store.dispatch, payload);
            });

            it('should update state with null fields if an error occurred while joining the room', function(done) {
                const payload = {
                    payload: {
                        room_id: '000000000000000000000004',
                    },
                    error: 'Error: Something happened',
                };

                const initialState = {};
                const store = configureStore(rootReducer, null, initialState, {
                    ROOM_JOINED: ({ dispatch, getState }) => {
                        const state = getState().usr;
                        expect(state).to.deep.equal({
                            roomId: null,
                            roomName: null,
                        });
                        done();
                    },
                });

                dispatchReduceRoomJoined(store.dispatch, payload);
            });
        });

        describe('ROOM_CREATED', function() {
            it('should update state after player created the room', function(done) {
                const payload = {
                    room_id: '000000000000000000000004',
                    room_name: 'room_1',
                };

                const initialState = {};
                const store = configureStore(rootReducer, null, initialState, {
                    ROOM_CREATED: ({ dispatch, getState }) => {
                        const state = getState().usr;
                        expect(state).to.deep.equal({
                            roomId: '000000000000000000000004',
                            roomName: 'room_1',
                        });
                        done();
                    },
                });

                dispatchReduceRoomCreated(store.dispatch, payload);
            });

            it('should update state with null fields if an error occurred while creating the room', function(done) {
                const payload = {
                    error: 'Error: Something happened',
                };

                const initialState = {};
                const store = configureStore(rootReducer, null, initialState, {
                    ROOM_CREATED: ({ dispatch, getState }) => {
                        const state = getState().usr;
                        expect(state).to.deep.equal({
                            roomId: null,
                            roomName: null,
                        });
                        done();
                    },
                });

                dispatchReduceRoomCreated(store.dispatch, payload);
            });
        });
    });

    describe('#handleUpdateActiveRooms() - UPDATE_ACTIVE_ROOMS', function() {
        it('should check the room is still active and return the state as it is', function(done) {
            const payload = {
                rooms: [roomsFixtures.roomStringFields()],
                lobby: roomsFixtures.lobby(),
                error: undefined,
            };

            const initialState = {
                usr: {
                    id: '00000000000000000000000d',
                    name: 'Waldo',
                    roomId: '000000000000000000000004',
                    roomName: 'room_1',
                },
            };
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    const state = getState().usr;
                    expect(state).to.deep.equal({
                        id: '00000000000000000000000d',
                        name: 'Waldo',
                        roomId: '000000000000000000000004',
                        roomName: 'room_1',
                    });
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });

        it('should update the state and notify the user if the room is not active anymore', function(done) {
            const payload = {
                rooms: [],
                lobby: roomsFixtures.lobby(),
                error: undefined,
            };
            const checkSocketStub = sandbox.stub(checkSocketId, 'default').returns();
            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {
                usr: {
                    id: '00000000000000000000000d',
                    name: 'Waldo',
                    roomId: '000000000000000000000004',
                    roomName: 'room_1',
                },
            };
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    expect(checkSocketStub.callCount).to.equal(1);
                    expect(notifyStub.args).to.deep.equal([
                        [{ type: 'error', msg: 'Error: the room has been disconnected' }],
                    ]);

                    const state = getState().usr;
                    expect(state).to.deep.equal({
                        id: '00000000000000000000000d',
                        name: 'Waldo',
                        roomId: null,
                        roomName: null,
                    });
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });

        it('should return the state as it is if there is an error', function(done) {
            const payload = {
                error: 'error',
            };

            const initialState = {
                usr: {
                    id: '00000000000000000000000d',
                    name: 'Waldo',
                    roomId: '000000000000000000000004',
                    roomName: 'room_1',
                },
            };
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    const state = getState().usr;
                    expect(state).to.deep.equal({
                        id: '00000000000000000000000d',
                        name: 'Waldo',
                        roomId: '000000000000000000000004',
                        roomName: 'room_1',
                    });
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });

        it('should return the state as it is if the player is not currently in a room', function(done) {
            const payload = {
                rooms: [roomsFixtures.roomStringFields()],
                lobby: roomsFixtures.lobby(),
                error: undefined,
            };

            const initialState = {
                usr: {
                    id: '00000000000000000000000d',
                    name: 'Waldo',
                    roomId: null,
                    roomName: null,
                },
            };
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    const state = getState().usr;
                    expect(state).to.deep.equal({
                        id: '00000000000000000000000d',
                        name: 'Waldo',
                        roomId: null,
                        roomName: null,
                    });
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });

        it('should return the state as it is if there is no rooms in the payload', function(done) {
            const payload = {
                rooms: null,
                lobby: roomsFixtures.lobby(),
                error: undefined,
            };

            sandbox.stub(notify, 'default'); // avoid test from roomReducer

            const initialState = {
                usr: {
                    id: '00000000000000000000000d',
                    name: 'Waldo',
                    roomId: '000000000000000000000004',
                    roomName: 'room_1',
                },
            };
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                UPDATE_ACTIVE_ROOMS: ({ dispatch, getState }) => {
                    const state = getState().usr;
                    expect(state).to.deep.equal({
                        id: '00000000000000000000000d',
                        name: 'Waldo',
                        roomId: '000000000000000000000004',
                        roomName: 'room_1',
                    });
                    done();
                },
            });

            dispatchReduceUpdateActiveRooms(store, payload);
        });
    });

    describe('#handleUserLogOut() - USER_LOGOUT', function() {
        it('should update state after user logged out', function(done) {
            const initialState = {
                usr: {
                    id: '00000000000000000000000d',
                    name: 'Waldo',
                    roomId: '000000000000000000000004',
                    roomName: 'room_1',
                },
            };
            const store = configureStore(rootReducer, null, initialState, {
                USER_LOGOUT: ({ dispatch, getState }) => {
                    const state = getState().usr;
                    expect(state).to.deep.equal({
                        id: null,
                        name: null,
                        roomId: null,
                        roomName: null,
                    });
                    done();
                },
            });

            updateStateAtLogout(store.dispatch);
        });
    });

    describe('#handleSetSocket() - SET_SOCKET', function() {
        it('should update state with the socket id', function(done) {
            const initialState = {};
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                SET_SOCKET: ({ dispatch, getState }) => {
                    const state = getState().usr;
                    expect(state).to.deep.equal({
                        socketId: '0000001',
                    });
                    done();
                },
            });

            checkSocketId.setSocket(store.dispatch, socket);
        });
    });
});
