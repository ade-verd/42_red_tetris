'use strict';

import notify from '../actions/notifications';

const handleError = (state, error, errorFieldName) => {
    console.error(`[player reducer][${errorFieldName}]`, error);
    return { ...state };
};

const handlePlayerCreated = (state, action) => {
    if (action.error !== undefined) {
        if (action.error.startsWith('ValidationError')) {
            notify({ type: 'warning', msg: 'Player name is missing' });
        } else {
            notify({ type: 'error', msg: 'Error while creating the player' });
        }
        return handleError(state, action.error, 'creationError');
    }

    return {
        ...state,
        players: {
            ...state.players,
            [action.player._id]: action.player.name,
        },
    };
};

const handleUpdatePlayersNames = (state, action) => {
    if (action.error !== undefined) {
        notify({ type: 'error', msg: action.error });
        return handleError(state, action.error, 'updateNamesError');
    }

    let roomPlayers = {};
    console.log('PLAAYERS', action);
    action.players.forEach(player => {
        roomPlayers[player._id] = player.name;
    });

    return {
        ...state,
        players: { ...state.players, ...roomPlayers },
    };
};

const reducer = (state = {}, action) => {
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
