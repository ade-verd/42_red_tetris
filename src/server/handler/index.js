'use strict';

const fs = require('fs');

const ERRORS = {
    E404: '404: File not found',
    E500: '500: Internal server error ',
};

const checkFileExist = path => {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.F_OK, err => {
            if (err) {
                reject(new Error(ERRORS.E404));
            }
            resolve();
        });
    });
};

const readFile = path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(new Error(ERRORS.E500));
            }
            resolve(data);
        });
    });
};

const requestHandler = (req, res) => {
    console.log('req.url', req.url);
    let file = '/../../client' + req.url;
    if (req.url === '/') file += 'index.html';
    const path = __dirname + file;
    const fallbackPath = __dirname + '/../../client/index.html';

    checkFileExist(path)
        .then(() => readFile(path))
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
            readFile(fallbackPath)
                .then(data => res.end(data))
                .catch(err => res.end(err.message));
            break;
        default:
            res.writeHead(500);
            return res.end(err.message);
    }
};

module.exports = requestHandler;
