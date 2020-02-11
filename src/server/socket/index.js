import { bindEvent } from './eventHelpers';

import * as serverTestHandler from './handlers/serverTest';

const handlers = Object.values({
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
