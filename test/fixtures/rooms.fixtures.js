const { ObjectId } = require('mongodb');

const room_1player = () => ({
	_id: new ObjectId('000000000000000000000001'),
	room_name: 'room_1',
	players_ids: [
		'00000000000000000000000a',
	],
	game_status: 'waiting',
	block_list: [],
	settings: [],
	created_at: "2020-01-01T10:00:00Z",
	updated_at: "2020-01-01T10:00:00Z",
});

const room_2players = () => ({
	_id: new ObjectId('000000000000000000000002'),
	room_name: 'room_2',
	players_ids: [
		'00000000000000000000000a',
		'00000000000000000000000b',
	],
	game_status: 'waiting',
	block_list: [],
	settings: [],
	created_at: "2020-01-01T10:00:00Z",
	updated_at: "2020-01-01T10:00:00Z",
});

const room_3players = () => ({
	_id: new ObjectId('000000000000000000000003'),
	room_name: 'room_3',
	players_ids: [
		'00000000000000000000000a',
		'00000000000000000000000b',
		'00000000000000000000000c',
	],
	game_status: 'waiting',
	block_list: [],
	settings: [],
	created_at: "2020-01-01T10:00:00Z",
	updated_at: "2020-01-01T10:00:00Z",
});

module.exports = {
	default: [
		room_1player(),
		room_2players(),
		room_3players(),
	]
}