import config from './config';
import * as server from './index';

server.create(config.server).then(() => console.log('starting the redtetris server...'));
