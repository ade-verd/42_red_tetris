import { bindEvent } from './eventHelpers';

import * as chatHandlers from './handlers/chat';
import * as commonHandlers from './handlers/common';
import * as gamesHandlers from './handlers/games';
import * as piecesHandlers from './handlers/pieces';
import * as spectrumsHandlers from './handlers/spectrums';
import * as gameStartHandlers from './handlers/gameStart';
import * as playersHandlers from './handlers/players';
import * as roomsHandlers from './handlers/rooms';
import * as serverTestHandler from './handlers/serverTest';

import * as playerSocketLib from './lib/playersSocket/checkConnectedSocket';

import * as config from '../config';

const handlers = Object.values({
    ...chatHandlers,
    ...commonHandlers,
    ...gamesHandlers,
    ...piecesHandlers,
    ...spectrumsHandlers,
    ...gameStartHandlers,
    ...playersHandlers,
    ...roomsHandlers,
    ...serverTestHandler,
});

let ioInstance = null;

export const initSocketIo = io => {
    ioInstance = io;
    io.on('connection', socket => {
        console.log('Socket connected:', socket.id);
        io.emit('server/start');
        handlers.forEach(handler => {
            bindEvent(socket, handler);
        });
    });

    setInterval(() => {
        // playerSocketLib.checkConnectedSocket(io);
        roomsHandlers.emitActiveRooms();
    }, config.rooms.refreshIntervalMs);
};

export const getIo = () => ioInstance;
