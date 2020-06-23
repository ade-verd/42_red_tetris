const config = require('./config');
const server = require('./index');

function run(cb) {
    server
        .create(config.server)
        .then(srv => {
            console.log('starting the redtetris server...');
            cb(null, srv);
        })
        .catch(err => cb(err, null));
}

/* istanbul ignore if */
if (require.main === module) {
    run(err => {
        if (err) console.error(err);
    });
}

module.exports = { run };
