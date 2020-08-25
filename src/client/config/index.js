export default {
    env: process.env.NODE_ENV,
    server: {
        host: process.env.CONFIG_SERVER_HOST || '0.0.0.0',
        port: process.env.PORT || 3004,
        get url() {
            if (process.env.NODE_ENV === 'production') return;
            return 'http://' + this.host + ':' + this.port;
        },
    },
    logger: {
        isReduxLoggerEnabled: process.env.IS_REDUXLOGGER_ENABLED === 'true',
        level: process.env.LOG_LEVEL || 'trace',
    },
};
