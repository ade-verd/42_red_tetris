const { ObjectId } = require('mongodb');

const toBeInsertedDirectly = () => [
    {
        _id: new ObjectId('00000000000000000000000a'),
        socket_id: '0000000001',
        room_id: null,
        name: 'Will',
        blocks_consumed: 0,
        created_at: new Date('2020-01-01T10:00:00Z'),
        updated_at: new Date('2020-01-01T10:00:00Z'),
    },
    {
        _id: new ObjectId('00000000000000000000000b'),
        socket_id: '0000000002',
        name: 'Carlton',
        room_id: null,
        blocks_consumed: 7,
        created_at: new Date('2020-01-01T10:00:00Z'),
        updated_at: new Date('2020-01-01T10:00:00Z'),
    },
    {
        _id: new ObjectId('00000000000000000000000c'),
        socket_id: '0000000003',
        room_id: null,
        name: 'Jeffrey',
        blocks_consumed: 15,
        created_at: new Date('2020-01-01T10:00:00Z'),
        updated_at: new Date('2020-01-01T10:00:00Z'),
    },
];

const insertedPlayer = () => ({
    _id: new ObjectId('00000000000000000000000d'),
    socket_id: '0000000004',
    name: 'Waldo',
    room_id: null,
    blocks_consumed: 0,
    created_at: new Date('2020-01-01T10:00:00Z'),
    updated_at: new Date('2020-01-01T10:00:00Z'),
});

const playerStringFields = () => ({
    _id: '00000000000000000000000d',
    socket_id: '0000000004',
    name: 'Waldo',
    room_id: null,
    blocks_consumed: 0,
    created_at: '2020-01-01T10:00:00Z',
    updated_at: '2020-01-01T10:00:00Z',
});

const player1 = () => ({
    socket_id: '0000000005',
    room_id: null,
    name: 'Chandler',
    blocks_consumed: 15,
});

const player2 = () => ({
    socket_id: '0000000006',
    room_id: null,
    name: 'Joey',
    blocks_consumed: 52,
});

const player3 = () => ({
    socket_id: '0000000007',
    room_id: null,
    name: 'Ross',
    blocks_consumed: 36,
});

const player4 = () => ({
    socket_id: '0000000008',
    room_id: null,
    name: 'Monica',
    blocks_consumed: 22,
});

const player5 = () => ({
    socket_id: '0000000009',
    room_id: null,
    name: 'Rachel',
    blocks_consumed: 39,
});

module.exports = {
    default: toBeInsertedDirectly,
    insertedPlayer,
    playerStringFields,
    player1,
    player2,
    player3,
    player4,
    player5,
};
