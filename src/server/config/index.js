module.exports = {
	server: {
    	host: '0.0.0.0',
    	port: process.env.CONFIG_REDTETRIS_SERVER_PORT || 3004,
    	get url(){ return 'http://' + this.host + ':' + this.port } 
	},
	db: {
		name: 'redtetris',
		host: process.env.CONFIG_MONGODB_HOST || 'localhost',
		port: process.env.CONFIG_MONGODB_PORT || 27017,
    	get url(){ return 'mongodb://' + this.host + ':' + this.port }, 
		options: {
			useUnifiedTopology: true,
			authSource: 'redtetris',
			authMechanism: 'SCRAM-SHA-1',
			auth: {
				user: process.env.CONFIG_MONGODB_USERNAME || 'red', 
				password: process.env.CONFIG_MONGODB_PASSWORD || 'tetris',
			}
		}
	}
}