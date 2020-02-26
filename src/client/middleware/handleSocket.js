import openSocket from 'socket.io-client';

export const handleSocket = () => {
	// const socket = io.connect(serverURI, options);
	const socket = openSocket('http://localhost:3004');

	console.log('TEST1')

	return ({ getState }) => next => (action) => {
		console.log('[testMiddleWare]', getState())
		if (typeof action === 'function') {
			return next(action);
		}
		const {
			event,
			leave,
			handle,
			emit,
			connect,
			data,
		} = action;

		if (!event) {
			return next(action);
		}

		if (emit) {
			// const { gameReducer } = getState();
			// const { currentPlayer, room } = gameReducer;
			const state = getState();
			console.log(state)
			
			return socket.emit(event, { ...data });
		}

		if (connect) {
			return socket.connect();
		}

		if (leave) {
			return socket.removeEventListener(event);
		}

		return socket.on(event, handle);
	};
};
