import config  from './config'
import * as server from './index'

server.create(config.server).then( () => console.log('not yet ready to play tetris with U ...') )
