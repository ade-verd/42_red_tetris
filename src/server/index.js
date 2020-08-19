'use strict';

const mongodb = require('./lib/mongodb');
const models = require('./models');

const handler = require('./handler');
const socket = require('./socket');

let io = null;
let app = null;

const appListen = (app, params, cb) => {
    const { host, port } = params;

    app.on('request', handler);

    app.listen({ host, port }, () => {
        console.log(`tetris listen on ${params.url}`);
        cb();
    });
};

const initApp = (app, params, cb) => {
    if (params.startMongodb) {
        new Promise((resolve, reject) => {
            resolve(mongodb.connect());
        }).then(() => {
            models.createCollectionsIndexes();
            appListen(app, params, cb);
        });
    } else {
        appListen(app, params, cb);
    }
};

const stop = cb => {
    mongodb.disconnect();
    io.close();
    app.close(() => {
        app.unref();
        console.log('Engine stopped');
        cb();
    });
};

const create = params => {
    const promise = new Promise((resolve, reject) => {
        app = require('http').createServer();
        initApp(app, params, () => {
            io = require('socket.io')(app, { cookie: false });
            socket.initSocketIo(io);
            resolve({ stop });
        });
    });
    return promise;
};

module.exports = {
    create,
};
