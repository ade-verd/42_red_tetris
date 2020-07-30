const fs = require('fs');
const debug = require('debug');

const mongodb = require('./lib/mongodb');
const models = require('./models');

const socket = require('./socket');

const logerror = debug('tetris:error'),
    loginfo = debug('tetris:info');

let io = null;
let app = null;

const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html';
    fs.readFile(__dirname + file, (err, data) => {
        if (err) {
            logerror(err);
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
};

const appListen = (app, params, cb) => {
    const { host, port } = params;

    app.on('request', handler);

    app.listen({ host, port }, () => {
        loginfo(`tetris listen on ${params.url}`);
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
        loginfo('Engine stopped');
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
    loginfo,
    logerror,
};
