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

db.createCollection('rooms', {});
db.rooms.createIndex(
	{ room_name: 1 },
	{ unique: true, background: true },
);

db.createCollection('players', {});
db.players.insert({
	name: "Example",
	blocks_consumed: 17,
});

db.createCollection('spectrums', {});
db.spectrums.createIndex(
	{ room_id: 1 },
	{ unique: true, background: true },
);

db.createCollection('highscores', {});