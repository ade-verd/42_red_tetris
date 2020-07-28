'use strict';

export const ACTIONS = {
    CONNECT: 'connect',
    EMIT: 'emit',
    GET_SOCKET: 'get_socket',
    LISTEN: 'listen',
    QUIT: 'quit',
    REDUCE: 'reduce',
};

export const handleSocket = socket => {
    return ({ getState }) => next => payload => {
        if (typeof payload === 'function') {
            return next(payload);
        }
        const { action, event, fn, data = {} } = payload;

        switch (action) {
            case ACTIONS.GET_SOCKET:
                return socket;
            case ACTIONS.EMIT:
                return socket.emit(event, { ...data });
            case ACTIONS.LISTEN:
                return socket.on(event, fn);
            case ACTIONS.REDUCE:
                return next(payload);
            case ACTIONS.CONNECT:
                return socket.connect();
            case ACTIONS.QUIT:
                return socket.removeEventListener(event);
        }
    };
};
