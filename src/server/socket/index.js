import { bindEvent } from './eventHelpers';

import * as createPlayerHandler from './handlers/createPlayer';
import * as getTetriminosHandler from './handlers/getTetriminos';
import * as serverTestHandler from './handlers/serverTest';

const handlers = Object.values({
	...createPlayerHandler,
	...getTetriminosHandler,
	...serverTestHandler,
});

export const initSocketIo = (io) => {
	io.on("connection", (socket) => {
		console.log('Socket connected:', socket.id);
		handlers.forEach((handler) => {
			bindEvent(socket, handler);
		});
	});
};
