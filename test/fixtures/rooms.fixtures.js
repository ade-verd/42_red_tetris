const { ObjectId } = require('mongodb');

const { GAME_STATUS } = require('../../src/server/constants')

const toBeInsertedDirectly = () => ([
	{
		_id: new ObjectId('000000000000000000000001'),
		room_name: 'room_1',
		players_ids: [
			'00000000000000000000000a',
		],
		game_status: GAME_STATUS.WAITING,
		block_list: [],
		settings: {},
		created_at: new Date('2020-01-01T10:00:00Z'),
		updated_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000002'),
		room_name: 'room_2',
		players_ids: [
			'00000000000000000000000a',
			'00000000000000000000000b',
		],
		game_status: GAME_STATUS.WAITING,
		block_list: [],
		settings: {},
		created_at: new Date('2020-01-01T10:00:00Z'),
		updated_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000003'),
		room_name: 'room_3',
		players_ids: [
			'00000000000000000000000a',
			'00000000000000000000000b',
			'00000000000000000000000c',
		],
		game_status: GAME_STATUS.WAITING,
		block_list: [],
		settings: {},
		created_at: new Date('2020-01-01T10:00:00Z'),
		updated_at: new Date('2020-01-01T10:00:00Z'),
	}
]);

const room1Player = () => ({
	room_name: 'room_4',
	players_ids: [
		'00000000000000000000000a',
	],
	game_status: GAME_STATUS.WAITING,
	block_list: [],
	settings: {},
});

const room2Players = () => ({
	room_name: 'room_5',
	players_ids: [
		'00000000000000000000000a',
		'00000000000000000000000b',
	],
	game_status: GAME_STATUS.PLAYING,
	block_list: [],
	settings: {},
});

const room3Players = () => ({
	room_name: 'room_6',
	players_ids: [
		'00000000000000000000000a',
		'00000000000000000000000b',
		'00000000000000000000000c',
	],
	game_status: GAME_STATUS.OFFLINE,
	block_list: [],
	settings: {},
});

module.exports = {
	default: toBeInsertedDirectly,
	room1Player,
	room2Players,
	room3Players,
}