/* istanbul ignore file */
module.exports = {
    ...require('./createRoom'),
    ...require('./getActiveRooms'),
    ...require('./getPlayers'),
    ...require('./joinRoom'),
    ...require('./leaveRoom'),
};
