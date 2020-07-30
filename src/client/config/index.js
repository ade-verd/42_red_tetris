module.exports = {
    server: {
        host: process.env.CONFIG_SERVER_HOST || '0.0.0.0',
        port: process.env.PORT || 3004,
        get url() {
            return 'http://' + this.host + ':' + this.port;
        },
    },
};
