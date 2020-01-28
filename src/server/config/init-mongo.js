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
db.rooms.insert({
	room_name: "example",
	players_ids: [
		ObjectId(),
		ObjectId(),
		ObjectId(),
		ObjectId(),
		ObjectId(),
	],
	game_status: "waiting",
	block_list: [],
	settings: {},
});

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
db.spectrums.insert({
	room_id: ObjectId(),
	spectrums: [{
		player_id: ObjectId(),
		sprectrum: [],
	}],
});

db.createCollection('highscores', {});