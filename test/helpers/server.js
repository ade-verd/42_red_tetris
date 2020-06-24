import * as server from '../../src/server/index';

export const startServer = (params, cb) => {
    const config = { ...params, startMongodb: params.startMongodb === true };

    server
        .create(config)
        .then(server => cb(null, server))
        .catch(err => cb(err));
};
