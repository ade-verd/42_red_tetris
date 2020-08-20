'use strict';

const fs = require('./file');

const ERRORS = {
    E404: '404: File not found',
    E500: '500: Internal server error ',
};

const handler = (req, res) => {
    console.log('req.url', req.url);
    let file = '/../../client' + req.url;
    if (req.url === '/') file += 'index.html';
    const path = __dirname + file;
    const fallbackPath = __dirname + '/../../client/index.html';

    fs.checkFileExist(path)
        .then(() => fs.readFile(path))
        .then(data => {
            res.writeHead(200);
            res.end(data);
        })
        .catch(err => {
            errorsHandler(res, err, fallbackPath);
        });
};

const errorsHandler = (res, err, fallbackPath) => {
    console.error(err);
    switch (err.message) {
        case ERRORS.E404:
            res.writeHead(404);
            fs.readFile(fallbackPath)
                .then(data => res.end(data))
                .catch(err => res.end(err.message));
            break;
        default:
            res.writeHead(500);
            return res.end(err.message);
    }
};

module.exports = { handler, errorsHandler, ERRORS };
