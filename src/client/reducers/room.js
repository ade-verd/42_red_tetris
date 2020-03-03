'use strict';

const handleError = (state, error, errorFieldName) => {
    return {
        ...state,
        rooms: {
            ...state.rooms,
            [errorFieldName]: error,
        },
    };
};

const checkAndUpdatePlayersNames = (playerState, rooms, fnUpdatePlayers) => {
    if (!rooms) return;

    rooms.forEach(room => {
        let arePlayersMissing = false;

        room.players_ids.forEach(playerId => {
            if (!(playerState && playerState[playerId])) {
                arePlayersMissing = true;
                return;
            }
        });

        if (arePlayersMissing === true) {
            fnUpdatePlayers(room._id);
        }
    });
};

const handleUpdateActiveRooms = (state, action) => {
    if (action.error !== undefined) return handleError(state, action.error, 'updateRoomsError');

    checkAndUpdatePlayersNames(state.players, action.rooms, action.fnUpdatePlayers);
    return {
        ...state,
        rooms: action.rooms,
        updateRoomsError: null,
    };
};

const handleRoomCreation = (state, action) => {
    if (action.error !== undefined) return handleError(state, action.error, 'roomCreationError');

    return { ...state, roomCreationError: null };
};

const reducer = (state = {}, action) => {
    console.log('[roomReducer] State', state);
    switch (action.type) {
        case 'UPDATE_ACTIVE_ROOMS':
            return handleUpdateActiveRooms(state, action);
        case 'ROOM_CREATED':
            return handleRoomCreation(state, action);
        default:
            return state;
    }
};

export default reducer;
