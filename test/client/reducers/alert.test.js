import { expect } from 'chai';
import sinon from 'sinon';

import { configureStore } from '../../helpers/server';
import rootReducer from '../../../src/client/reducers';
import { ALERT_POP, alert } from '../../../src/client/actions/alert';

const MESSAGE = 'message';

describe('Fake redux test', function() {
    beforeEach(() => {
        sinon.stub(console, 'debug');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('alert it', function(done) {
        const initialState = {};
        const store = configureStore(rootReducer, null, initialState, {
            ALERT_POP: ({ dispatch, getState }) => {
                const state = getState().alt;
                expect(state).to.deep.equal({ message: MESSAGE });
                done();
            },
        });
        store.dispatch(alert(MESSAGE));
    });
});
