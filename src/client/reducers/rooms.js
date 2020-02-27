const reducer = (state = {}, action) => {
    console.log('[roomsReducer] State = ', state);
    switch (action.type) {
        case 'UPDATE_ACTIVE_ROOMS':
            return {
                ...state,
                rooms: action.rooms,
            };
        default:
            return state;
    }
};

export default reducer;
