module.exports = {
    server: {
        host: process.env.CONFIG_REDTETRIS_SERVER_HOST || '0.0.0.0',
        port: process.env.CONFIG_REDTETRIS_SERVER_PORT || 3004,
        get url() {
            return 'http://' + this.host + ':' + this.port;
        },
    },
};
