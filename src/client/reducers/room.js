'use strict';

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

const reducer = (state = {}, action) => {
    console.log('[roomReducer] State', state);
    switch (action.type) {
        case 'UPDATE_ACTIVE_ROOMS':
            checkAndUpdatePlayersNames(state.players, action.rooms, action.fnUpdatePlayers);
            return {
                ...state,
                rooms: action.rooms,
            };
        default:
            return state;
    }
};

export default reducer;
