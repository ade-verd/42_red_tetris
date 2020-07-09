const eventHelpers = require('./eventHelpers');

const ioInstance = require('./ioInstance');

const chatHandlers = require('./handlers/chat');
const commonHandlers = require('./handlers/common');
const gamesHandlers = require('./handlers/games');
const piecesHandlers = require('./handlers/pieces');
const spectrumsHandlers = require('./handlers/spectrums');
const gameStartHandlers = require('./handlers/gameStart');
const malusHandlers = require('./handlers/malus');
const playersHandlers = require('./handlers/players');
const roomsHandlers = require('./handlers/rooms');
const serverTestHandler = require('./handlers/serverTest');

const playerSocketLib = require('./lib/playersSocket/checkConnectedSocket');

const config = require('../config');

const handlers = Object.values({
    ...chatHandlers,
    ...commonHandlers,
    ...gamesHandlers,
    ...piecesHandlers,
    ...spectrumsHandlers,
    ...gameStartHandlers,
    ...malusHandlers,
    ...playersHandlers,
    ...roomsHandlers,
    ...serverTestHandler,
});

const initSocketIo = io => {
    ioInstance.set(io);
    io.on('connection', socket => {
        console.log('Socket connected:', socket.id);
        handlers.forEach(handler => {
            eventHelpers.bindEvent(socket, handler);
        });
        io.emit('server/start');

        let timer = new Date();
        setInterval(() => {
            const isDelayConsumed = new Date() - timer >= config.rooms.refreshIntervalMs;
            console.log('Time since last one: ', new Date() - timer, 'seconds');
            if (isDelayConsumed) {
                // playerSocketLib.checkConnectedSocket(io);
                roomsHandlers.emitActiveRooms();
                timer = new Date();
            }
        }, config.rooms.refreshIntervalMs);
    });
};

module.exports = {
    initSocketIo,
    handlers,
};
