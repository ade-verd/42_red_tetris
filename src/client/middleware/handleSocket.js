import openSocket from 'socket.io-client';

import config from '../config';

export const ACTIONS = {
    EMIT: 'emit',
    LISTEN: 'listen',
    REDUCE: 'reduce',
    CONNECT: 'connect',
    QUIT: 'quit',
};

export const handleSocket = () => {
    const socket = openSocket(config.server.url);

    return ({ getState }) => next => payload => {
        if (typeof payload === 'function') {
            return next(payload);
        }
        const { action, event, fn, data = {} } = payload;

        const state = getState();
        console.debug('[handleSocket] State', state);

        switch (action) {
            case ACTIONS.EMIT:
                console.debug(`[handleSocket][emit][${event}]`, data);
                return socket.emit(event, { ...data });
            case ACTIONS.LISTEN:
                console.debug(`[handleSocket][on][${event}]`);
                return socket.on(event, fn);
            case ACTIONS.REDUCE:
                console.debug('[handleSocket][reduce]', payload);
                return next(payload);
            case ACTIONS.CONNECT:
                console.debug('[handleSocket][connect]');
                return socket.connect();
            case ACTIONS.QUIT:
                console.debug(`[handleSocket][quit][${event}]`);
                return socket.removeEventListener(event);
        }
    };
};
