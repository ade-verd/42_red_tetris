const { expect } = require('chai');
const fs = require('fs');
const sinon = require('sinon');

const file = require('../../../src/server/handler/file');

describe.only('server/handler/file', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('#checkFileExist', () => {
        it('should check file and access the file', done => {
            const path = __filename;
            file.checkFileExist(path)
                .then(() => done())
                .catch(() => {
                    throw new Error('should not reject');
                });
        });

        it('should check file and can not access the file', done => {
            const path = __filename + 'thisFileDoesNotExist';
            file.checkFileExist(path)
                .then(() => {
                    throw new Error('should not resolve');
                })
                .catch(err => {
                    expect(err)
                        .to.be.instanceOf(Error)
                        .with.property('message', '404: File not found');
                    done();
                });
        });
    });
    describe('#readFile', () => {
        it('should read file and resolve', done => {
            const path = __filename;
            fs.readFile(path, (err, expectedData) => {
                if (err) throw err;

                file.readFile(path)
                    .then(data => {
                        expect(data).to.deep.equal(expectedData);
                        done();
                    })
                    .catch(() => {
                        throw new Error('should not reject');
                    });
            });
        });

        it('should not read file and reject', done => {
            const path = __filename + 'thisFileDoesNotExist';
            file.readFile(path)
                .then(() => {
                    throw new Error('should not resolve');
                })
                .catch(err => {
                    expect(err)
                        .to.be.instanceOf(Error)
                        .with.property('message', '500: Internal server error');
                    done();
                });
        });
    });
});
