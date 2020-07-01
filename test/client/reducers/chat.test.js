import { expect } from 'chai';
import sinon from 'sinon';

import { configureStore, fakeSocket } from '../../helpers/client';
import rootReducer from '../../../src/client/reducers';

import { addMessageToState } from '../../../src/client/actions/chat/chat';

import * as notify from '../../../src/client/actions/notifications';

describe('client/reducers/chat', function() {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sinon.stub(console, 'debug');
    });

    afterEach(() => {
        console.debug.restore();
        sandbox.restore();
    });

    describe('#handleMessageReceived() - CHAT_MESSAGE_RECEIVED', function() {
        it('should update the state with the new message', function(done) {
            const payload = {
                fromPlayerId: '000000000000000000000001',
                fromPlayerName: 'Bobby',
                toRoomId: 'lobby',
                message: "Hello, it's me: Bobby",
                date: 1577836800,
            };

            const initialState = {};
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                CHAT_MESSAGE_RECEIVED: ({ dispatch, getState }) => {
                    const state = getState().cht;
                    expect(state).to.deep.equal({
                        msg: {
                            lobby: [
                                {
                                    fromPlayerId: '000000000000000000000001',
                                    fromPlayerName: 'Bobby',
                                    toRoomId: 'lobby',
                                    message: "Hello, it's me: Bobby",
                                    date: 1577836800,
                                },
                            ],
                        },
                    });
                    done();
                },
            });

            addMessageToState(store.dispatch, payload);
        });

        it('should return the state as it is and notify the error', function(done) {
            const payload = {
                error: 'Error: Something happened',
            };

            const notifyStub = sandbox.stub(notify, 'default');

            const initialState = {};
            const socket = fakeSocket();
            const store = configureStore(rootReducer, socket, initialState, {
                CHAT_MESSAGE_RECEIVED: ({ dispatch, getState }) => {
                    expect(notifyStub.args).to.deep.equal([
                        [{ type: 'error', msg: 'Error: Something happened' }],
                    ]);

                    const state = getState().cht;
                    expect(state).to.deep.equal({});
                    done();
                },
            });

            addMessageToState(store.dispatch, payload);
        });
    });
});
