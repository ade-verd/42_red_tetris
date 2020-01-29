module.exports = {
	db: {
		name: 'redtetris',
		url: 'mongodb://localhost:27017',
		options: {
			useUnifiedTopology: true,
			authSource: 'redtetris',
			authMechanism: 'SCRAM-SHA-1',
			auth: {
				user: 'red', // process.env.CONFIG_MONGODB_USERNAME,
				password: 'tetris', //process.env.CONFIG_MONGODB_PASSWORD,
			}
		}
	}
}