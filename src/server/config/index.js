module.exports = {
	db: {
		name: 'redtetris',
		url: 'mongodb://localhost:27017/redtetris',
		options: {
			useUnifiedTopology: true,
			authMechanism: 'SCRAM-SHA-1',
			'auth.user': 'red',
			'auth.password': 'tetris',
			/*auth: {
				user: 'red', // process.env.CONFIG_MONGODB_ADMINUSERNAME, //
				password: 'tetris', //process.env.CONFIG_MONGODB_ADMINPASSWORD,
			}*/
		}
	}
}