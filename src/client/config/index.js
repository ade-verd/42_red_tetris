module.exports = {
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
};
