'use strict';

import { expect } from 'chai';
import { toast } from 'react-toastify';
import sinon from 'sinon';

import notify, {
    configureNotificationContainer,
} from '../../../../src/client/actions/notifications';

describe('client/actions/notifications/index', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('should configure toast', () => {
        const CONF = {
            position: 'bottom-right',
            autoClose: 4000,
            draggable: false,
            hideProgressBar: false,
            newestOnTop: true,
            closeOnClick: true,
            pauseOnHover: true,
        };
        const toastStub = sandbox.stub(toast, 'configure');

        configureNotificationContainer();

        expect(toastStub.args).to.deep.equal([[CONF]]);
    });

    it('should notify with info dialog', () => {
        const MSG = 'message';
        const TYPE = 'info';
        const toastStub = sandbox.stub(toast, TYPE);

        notify({ msg: MSG, type: TYPE });

        expect(toastStub.args).to.deep.equal([['message']]);
    });

    it('should notify with success dialog', () => {
        const MSG = 'message';
        const TYPE = 'success';
        const toastStub = sandbox.stub(toast, TYPE);

        notify({ msg: MSG, type: TYPE });

        expect(toastStub.args).to.deep.equal([['message']]);
    });

    it('should notify with warning dialog', () => {
        const MSG = 'message';
        const TYPE = 'warning';
        const toastStub = sandbox.stub(toast, TYPE);

        notify({ msg: MSG, type: TYPE });

        expect(toastStub.args).to.deep.equal([['message', { autoClose: 5000 }]]);
    });

    it('should notify with error dialog', () => {
        const MSG = 'message';
        const TYPE = 'error';
        const toastStub = sandbox.stub(toast, TYPE);

        notify({ msg: MSG, type: TYPE });

        expect(toastStub.args).to.deep.equal([['message', { autoClose: 6000 }]]);
    });

    it('should notify with error dialog by default', () => {
        const MSG = 'message';
        const TYPE = '';
        const toastStub = sandbox.stub(toast, 'error');

        notify({ msg: MSG, type: TYPE });

        expect(toastStub.args).to.deep.equal([['message', { autoClose: 6000 }]]);
    });
});
