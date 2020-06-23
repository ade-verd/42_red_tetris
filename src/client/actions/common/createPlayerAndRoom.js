import { ACTIONS } from '../../middlewares/handleSocket';

export const createPlayerAndRoomPayload = (playerName, roomName) => ({
    player_name: playerName,
    room_name: roomName,
});

export const emitCreatePlayerAndRoom = (dispatch, playerName, roomName) =>
    dispatch({
        action: ACTIONS.EMIT,
        event: 'players_rooms:create_join',
        data: createPlayerAndRoomPayload(playerName, roomName),
    });
