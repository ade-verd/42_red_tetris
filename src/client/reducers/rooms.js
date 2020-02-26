const reducer = (state = {}, action) => {
    console.log('[roomsReducer] State = ', state);
    switch (action.type) {
        case 'GET_ACTIVE_ROOMS':
            console.log('STARTED FIELD REDUCER');
            return {
                ...state,
                rooms: action.rooms,
            };
        default:
            return state;
    }
};

export default reducer;
