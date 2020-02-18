import { bindEvent } from './eventHelpers';

import * as piecesHandlers from './handlers/pieces';
import * as playersHandlers from './handlers/players';
import * as roomsHandlers from './handlers/rooms';
import * as serverTestHandler from './handlers/serverTest';

const handlers = Object.values({
    ...piecesHandlers,
    ...playersHandlers,
    ...roomsHandlers,
    ...serverTestHandler,
});

export const initSocketIo = io => {
    io.on('connection', socket => {
        console.log('Socket connected:', socket.id);
        io.emit('server/start');
        handlers.forEach(handler => {
            bindEvent(socket, handler);
        });
    });
};
