'use strict';

import notify from '../actions/Notification';

const handleError = (state, error, errorFieldName) => {
    notify({ type: 'error', msg: error });
    return {
        ...state,
        players: {
            ...state.players,
            [errorFieldName]: error,
        },
    };
};

const handlePlayerCreated = (state, action) => {
    if (action.error !== undefined) {
        return handleError(state, action.error, 'creationError');
    }

    return {
        ...state,
        players: {
            ...state.players,
            [action.player._id]: action.player.name,
            creationError: null,
        },
    };
};

const handleUpdatePlayersNames = (state, action) => {
    if (action.error !== undefined) {
        return handleError(state, action.error, 'updateNamesError');
    }

    let roomPlayers = {};
    action.players.forEach(player => {
        roomPlayers[player._id] = player.name;
    });

    return {
        ...state,
        players: { ...state.players, ...roomPlayers, updateNamesError: null },
    };
};

const reducer = (state = {}, action) => {
    console.log('[playerReducer] State', state);

    switch (action.type) {
        case 'PLAYER_CREATED':
            return handlePlayerCreated(state, action);
        case 'UPDATE_PLAYERS_NAMES':
            return handleUpdatePlayersNames(state, action);
        default:
            return state;
    }
};

export default reducer;
