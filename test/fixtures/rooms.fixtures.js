const { ObjectId } = require('mongodb');

const { GAME_STATUS, TETRIMINOS } = require('../../src/constants');

const toBeInsertedDirectly = () => ([
	{
		_id: new ObjectId('000000000000000000000001'),
		room_name: 'room_1',
		players_ids: [
			'00000000000000000000000a',
		],
		game_status: GAME_STATUS.WAITING,
		blocks_list: [],
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
		blocks_list: [],
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
		blocks_list: [],
		settings: {},
		created_at: new Date('2020-01-01T10:00:00Z'),
		updated_at: new Date('2020-01-01T10:00:00Z'),
	}
]);

const insertedRoom = () => ({
	_id: new ObjectId('000000000000000000000004'),
	room_name: 'room_1',
	players_ids: [
		'00000000000000000000000a',
	],
	game_status: GAME_STATUS.WAITING,
	blocks_list: generateBlocksList(2),
	settings: {},
	created_at: new Date('2020-01-01T10:00:00Z'),
	updated_at: new Date('2020-01-01T10:00:00Z'),
});

const room1Player = () => ({
	room_name: 'room_4',
	players_ids: [
		'00000000000000000000000a',
	],
	game_status: GAME_STATUS.WAITING,
	blocks_list: [],
	settings: {},
});

const room2Players = () => ({
	room_name: 'room_5',
	players_ids: [
		'00000000000000000000000a',
		'00000000000000000000000b',
	],
	game_status: GAME_STATUS.PLAYING,
	blocks_list: [],
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
	blocks_list: [],
	settings: {},
});

const blocksList = () => ([
	{ ...TETRIMINOS.I },
	{ ...TETRIMINOS.O },
]);

const generateBlocksList = (piecesNumber) => {
	const blocksList = [];

	let letter = 0;
	const blocksNames = TETRIMINOS.BLOCK_NAMES;
	for (let i = 0; i < piecesNumber; i += 1) {
		const piece = TETRIMINOS[blocksNames[letter]];
		blocksList.push(piece);
		letter = letter + 1 >= blocksNames.length ? 0 : letter + 1;
	}
	return blocksList;
};

module.exports = {
	default: toBeInsertedDirectly,
	insertedRoom,
	room1Player,
	room2Players,
	room3Players,
	blocksList,
	generateBlocksList,
}