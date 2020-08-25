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
        isReduxLoggerEnable: process.env.IS_ENABLE_REDUXLOGGER === 'true',
        level: process.env.LOG_LEVEL || 'trace',
    },
};
