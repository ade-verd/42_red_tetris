import { bindEvent } from './eventHelpers';

import * as serverTestHandler from './handlers/serverTest';
import * as getTetriminosHandler from './handlers/getTetriminos';

const handlers = Object.values({
	...serverTestHandler,
	...getTetriminosHandler,
});

export const initSocketIo = (io) => {
	io.on("connection", (socket) => {
		console.log('Socket connected:', socket.id);
		handlers.forEach((handler) => {
			bindEvent(socket, handler);
		});
	});
};
