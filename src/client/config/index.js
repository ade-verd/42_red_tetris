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
    favicon: process.env.NODE_ENV === 'production' ? 'favicon.ico' : './assets/img/favicon.ico',
    game: {
        commands: [
            {
                key: '▲',
                // key: '↑',
                action: 'Rotate the piece',
                key: 'ArrowUp',
            },
            {
                key: '▼',
                // key: '↓',
                action: 'Move the piece to the bottom',
                key: 'ArrowDown',
            },
            {
                key: '◄',
                // key: '←',
                action: 'Move the piece to the left',
                key: 'ArrowLeft',
            },
            {
                key: '►',
                // key: '→',
                action: 'Move the piece to the right',
                key: 'ArrowRight',
            },
            {
                key: 'Space',
                action: 'Drop the piece',
                code: 'Space',
            },
        ],
    },
    logger: {
        isReduxLoggerEnable: IS_ENABLE_REDUXLOGGER === 'true',
        level: process.env.LOG_LEVEL || 'trace',
    },
};
