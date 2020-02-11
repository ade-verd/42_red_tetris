const fs = require('fs');
const debug = require('debug');

const mongodb = require('./lib/mongodb');
const models = require('./models');

const { initSocketIo } = require('./socket');

const logerror = debug('tetris:error')
    , loginfo = debug('tetris:info');

const initApp = (app, params, cb) => {
  const {host, port, startMongodb = true} = params
  const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html'
    fs.readFile(__dirname + file, (err, data) => {
      if (err) {
        logerror(err)
        res.writeHead(500)
        return res.end('Error loading index.html')
      }
      res.writeHead(200)
      res.end(data)
    })
  }

  if (startMongodb) {
    new Promise((resolve, reject) => {
      resolve(mongodb.connect())
    }).then(() => models.createCollectionsIndexes())
  }

  app.on('request', handler)

  app.listen({host, port}, () =>{
    loginfo(`tetris listen on ${params.url}`)
    cb()
  })
}

function create(params){
  const promise = new Promise( (resolve, reject) => {
    const app = require('http').createServer()
    initApp(app, params, () =>{
      const io = require('socket.io')(app)
      const stop = (cb) => {
        mongodb.disconnect();

        io.close()
        app.close( () => {
          app.unref()
        })
        loginfo(`Engine stopped.`)

        cb()
      }

      initSocketIo(io);
      resolve({stop})
    });


  });
  return promise
}

module.exports = {
  create,
  loginfo,
  logerror,
}