const config = require('./config');
const server = require('./index');

server.create(config.server).then(() => console.log('starting the redtetris server...'));
