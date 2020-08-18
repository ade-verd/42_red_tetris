module.exports = {
    env: {
        isTestEnv: process.env.NODE_ENV === 'test',
    },
    server: {
        host: process.env.CONFIG_SERVER_HOST || '0.0.0.0',
        port: process.env.PORT || 3004,
        get url() {
            return 'http://' + this.host + ':' + this.port;
        },
    },
    db: {
        name: process.env.MONGODB_URI
            ? new URL(process.env.MONGODB_URI).pathname.substring(1)
            : 'redtetris',
        host: process.env.CONFIG_MONGODB_HOST || 'localhost',
        port: process.env.CONFIG_MONGODB_PORT || 27017,
        get url() {
            if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
            return 'mongodb://' + this.host + ':' + this.port;
        },
        options: {},
    },
    rooms: {
        refreshIntervalMs: parseInt(process.env.ROOMS_REFRESH_INTERVAL_MS, 10) || 30000,
    },
};
