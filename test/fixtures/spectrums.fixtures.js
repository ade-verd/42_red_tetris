const { ObjectId } = require('mongodb');

const toBeInsertedDirectly = () => ([
	{
		_id: new ObjectId('000000000000000000000001'),
		room_id: '000000000000000000000001',
		player_id: '00000000000000000000000a',
		spectrum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		created_at: new Date('2020-01-01T10:00:00Z'),
		updated_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000002'),
		room_id: '000000000000000000000001',
		player_id: '00000000000000000000000b',
		spectrum: [1, 1, 1, 1, 5, 6, 7, 7, 7, 7],
		created_at: new Date('2020-01-01T10:00:00Z'),
		updated_at: new Date('2020-01-01T10:00:00Z'),
	},
	{
		_id: new ObjectId('000000000000000000000003'),
		room_id: '000000000000000000000002',
		player_id: '00000000000000000000000c',
		spectrum: [2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
		created_at: new Date('2020-01-01T10:00:00Z'),
		updated_at: new Date('2020-01-01T10:00:00Z'),
	}
]);

const spectrum = () => ({
	room_id: '000000000000000000000003',
	player_id: '00000000000000000000000d',
	spectrum: [7, 7, 7, 7, 7, 7, 7, 7, 7, 6],
});

module.exports = {
	default: toBeInsertedDirectly,
	spectrum,
}