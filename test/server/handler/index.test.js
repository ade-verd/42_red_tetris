const { expect } = require('chai');
const fs = require('fs');
const sinon = require('sinon');

const file = require('../../../src/server/handler/file');
const requestHandler = require('../../../src/server/handler/index');

describe('server/handler/index', () => {
    const sandbox = sinon.createSandbox();

    const mockResponse = () => ({
        writeHead: sandbox.stub(),
        end: sandbox.stub(),
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('#handler', () => {
        it('should read index.html and return content', done => {
            const checkFileStub = sandbox.stub(file, 'checkFileExist').resolves();
            const readFileStub = sandbox.stub(file, 'readFile').resolves('file content');

            const req = { url: '/' };
            const res = mockResponse();
            requestHandler.handler(req, res);

            setTimeout(() => {
                const expectedPath = __dirname.replace('test', 'src') + '/../../client/index.html';
                expect(checkFileStub.args).to.deep.equal([[expectedPath]]);
                expect(readFileStub.args).to.deep.equal([[expectedPath]]);
                expect(res.writeHead.args).to.deep.equal([[200]]);
                expect(res.end.args).to.deep.equal([['file content']]);
                done();
            }, 50);
        });

        it('should fail to read requested file and returns 404 with fallback page', done => {
            const checkFileStub = sandbox
                .stub(file, 'checkFileExist')
                .rejects(new Error(file.ERRORS.E404));
            const readFileStub = sandbox.stub(file, 'readFile').resolves('fallback content');

            const req = { url: '/doesNotExist' };
            const res = mockResponse();
            requestHandler.handler(req, res);

            setTimeout(() => {
                const expectedPath =
                    __dirname.replace('test', 'src') + '/../../client/doesNotExist';
                const expectedFallbackPath =
                    __dirname.replace('test', 'src') + '/../../client/index.html';
                expect(checkFileStub.args).to.deep.equal([[expectedPath]]);
                expect(readFileStub.args).to.deep.equal([[expectedFallbackPath]]);
                expect(res.writeHead.args).to.deep.equal([[404]]);
                expect(res.end.args).to.deep.equal([['fallback content']]);
                done();
            }, 50);
        });

        it('should fail to read requested file and returns 404 with error message', done => {
            const checkFileStub = sandbox
                .stub(file, 'checkFileExist')
                .rejects(new Error(file.ERRORS.E404));
            const readFileStub = sandbox
                .stub(file, 'readFile')
                .rejects(new Error(file.ERRORS.E500));

            const req = { url: '/doesNotExist' };
            const res = mockResponse();
            requestHandler.handler(req, res);

            setTimeout(() => {
                const expectedPath =
                    __dirname.replace('test', 'src') + '/../../client/doesNotExist';
                const expectedFallbackPath =
                    __dirname.replace('test', 'src') + '/../../client/index.html';
                expect(checkFileStub.args).to.deep.equal([[expectedPath]]);
                expect(readFileStub.args).to.deep.equal([[expectedFallbackPath]]);
                expect(res.writeHead.args).to.deep.equal([[404]]);
                expect(res.end.args).to.deep.equal([['404: File not found']]);
                done();
            }, 50);
        });

        it('should throw for an unknown reason and returns 500', done => {
            const checkFileStub = sandbox.stub(file, 'checkFileExist').resolves();
            const readFileStub = sandbox
                .stub(file, 'readFile')
                .rejects(new Error(file.ERRORS.E500));

            const req = { url: '/doesNotExist' };
            const res = mockResponse();
            requestHandler.handler(req, res);

            setTimeout(() => {
                const expectedPath =
                    __dirname.replace('test', 'src') + '/../../client/doesNotExist';
                expect(checkFileStub.args).to.deep.equal([[expectedPath]]);
                expect(readFileStub.args).to.deep.equal([[expectedPath]]);
                expect(res.writeHead.args).to.deep.equal([[500]]);
                expect(res.end.args).to.deep.equal([['500: Internal server error']]);
                done();
            }, 50);
        });
    });
});
