/* istanbul ignore file */

db.createUser(
	{
		user: 'red',
		pwd: 'tetris',
		roles: [
			{
				role: 'readWrite',
				db: 'redtetris'
			}
		]
	}
);
