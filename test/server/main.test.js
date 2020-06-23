const { expect } = require('chai');
const sinon = require('sinon');

const main = require('../../src/server/main');
const server = require('../../src/server/index');

const config = require('../../src/server/config');

describe('main.js', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('should start the server', () => {
        const createServerStub = sandbox.stub(server, 'create').resolves();

        main.run((err, srv) => {
            expect(createServerStub.args).to.deep.equal([[config.server]]);
            expect(err).to.be.null;
        });
    });

    it('should catch server error', () => {
        const createServerStub = sandbox.stub(server, 'create').rejects(new Error('server error'));

        main.run((err, srv) => {
            expect(createServerStub.args).to.deep.equal([[config.server]]);
            expect(err)
                .to.be.an.instanceOf(Error)
                .with.property('message', 'Error: server error');
        });
    });
});
