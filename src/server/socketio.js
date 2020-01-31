import { findOneById } from './models/rooms/index'

const io = require('socket.io')();

// io.on('connection', (client) => {
// 	console.log('Client connected');
// 	client.on('subscribeToTimer', (interval) => {
// 		console.log('client is subscribing to timer with interval ', interval);
// 		setInterval(() => {
//       client.emit('timer', new Date());
//     }, interval);
//   });
// });

io.on('connection', async (client) => {
	console.log('Client connected');
	client.emit('db', await findOneById('000000000000000000000001'));
	console.log('Client connected2');
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);