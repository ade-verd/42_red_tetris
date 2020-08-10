'use strict';

import { expect } from 'chai';

import { ACTIONS } from '../../../../src/client/middlewares/handleSocket';
import { ALERT_POP, alert } from '../../../../src/client/actions/alert';
import { ping } from '../../../../src/client/actions/server';

describe('client/actions/game/status', () => {
    it('should return ALERT_POP action', () => {
        const ALERT = { action: ACTIONS.REDUCE, type: ALERT_POP, message: 'message' };

        expect(ALERT_POP).to.deep.equal('ALERT_POP');

        const res = alert('message');
        expect(res).to.deep.equal(ALERT);
    });

    it('should return server/ping type', () => {
        const res = ping();

        expect(res).to.deep.equal({ type: 'server/ping' });
    });
});
