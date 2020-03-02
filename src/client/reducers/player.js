const reducer = (state = {}, action) => {
    console.log('[playerReducer] State', state);

    switch (action.type) {
        case 'UPDATE_PLAYERS_NAMES':
            let roomPlayers = {};
            action.players.forEach(player => {
                roomPlayers[player._id] = player.name;
            });

            return {
                ...state,
                players: { ...state.players, ...roomPlayers },
            };
        default:
            return state;
    }
};

export default reducer;
