const { ObjectId } = require('mongodb');

const toBeInsertedDirectly = () => ([
	{
		_id: new ObjectId('000000000000000000000001'),
		player_id: '00000000000000000000000a',
		player_name: 'AAA',
		score: 8987745,
		created_at: new Date('2020-01-01T10:00:00Z'),
		updated_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000002'),
		player_id: '00000000000000000000000b',
		player_name: 'BBB',
		score: 78910,
		created_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000003'),
		player_id: '00000000000000000000000c',
		player_name: 'CCC',
		score: 999405611,
		created_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000004'),
		player_id: '00000000000000000000000d',
		player_name: 'DDD',
		score: 8948948944,
		created_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000005'),
		player_id: '00000000000000000000000e',
		player_name: 'EEE',
		score: 16,
		created_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000006'),
		player_id: '00000000000000000000000f',
		player_name: 'FFF',
		score: 848222600,
		created_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000007'),
		player_id: '00000000000000000000000g',
		player_name: 'GGG',
		score: 8489498498489,
		created_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000008'),
		player_id: '00000000000000000000000h',
		player_name: 'HHH',
		score: 1304984,
		created_at: new Date('2020-01-01T10:00:00Z'),
	}, {
		_id: new ObjectId('000000000000000000000009'),
		player_id: '00000000000000000000000i',
		player_name: 'III',
		score: 13,
		created_at: new Date('2020-01-01T10:00:00Z'),
	}
]);

const highscore = () => ({
	player_id: '00000000000000000000000j',
	player_name: 'JJJ',
	score: 99999999,
});

module.exports = {
	default: toBeInsertedDirectly,
	highscore,
}