'use strict';

import notify from '../actions/notifications';

import { newDate } from '../lib/utils/date';
import { ACTIONS } from '../middleware/handleSocket';

const handleError = (state, error, errorFieldName) => {
    console.error(`[room reducer][${errorFieldName}]`, error);
    return { ...state };
};

const checkAndUpdatePlayersNames = (store, rooms, action) => {
    let idsChecked = [];
    const playerState = store.getState().play.players;
    rooms.forEach(room => {
        let arePlayersMissing = false;

        room.players_ids.forEach(playerId => {
            const isAlreadyChecked = idsChecked.includes(playerId);
            const isInState = playerState && playerState[playerId];

            if (!isAlreadyChecked && !isInState) {
                if (room._id) {
                    arePlayersMissing = true;
                    return;
                }
                action.fnUpdateOnePlayer(store.dispatch, playerId);
                idsChecked = [...idsChecked, playerId];
            }
        });

        if (arePlayersMissing === true) {
            action.fnUpdatePlayers(store.dispatch, room._id);
            idsChecked = [...idsChecked, ...room.players_ids];
        }
    });
};

const handleUpdateActiveRooms = (state, action) => {
    if (action.error !== undefined || !action.rooms || !action.lobby) {
        const msgError = action.error ? action.error : 'Error: invalid active rooms payload';
        notify({ type: 'error', msg: msgError });
        return handleError(state, action.error, 'updateRoomsError');
    }

    const roomsAndLobby = [...action.rooms, action.lobby];
    checkAndUpdatePlayersNames(action.store, roomsAndLobby, action);
    return {
        ...state,
        rooms: action.rooms,
        lobby: action.lobby,
        updatedAt: newDate().valueOf(),
    };
};

const handleRoomCreation = (state, action) => {
    if (action.error !== undefined) {
        notify({ type: 'error', msg: action.error });
        return handleError(state, action.error, 'roomCreationError');
    }

    return { ...state };
};

const handleRoomJoined = (state, action) => {
    if (action.error !== undefined) {
        notify({ type: 'error', msg: action.error });
        return handleError(state, action.error, 'roomJoinedError');
    }

    return { ...state };
};

const handleRoomLeft = (state, action) => {
    if (action.error !== undefined) {
        notify({ type: 'error', msg: action.error });
        return handleError(state, action.error, 'roomLeftError');
    }

    return { ...state };
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_ACTIVE_ROOMS':
            return handleUpdateActiveRooms(state, action);
        case 'ROOM_CREATED':
            return handleRoomCreation(state, action);
        case 'ROOM_JOINED':
            return handleRoomJoined(state, action);
        case 'ROOM_LEFT':
            return handleRoomLeft(state, action);
        default:
            return state;
    }
};

export default reducer;
