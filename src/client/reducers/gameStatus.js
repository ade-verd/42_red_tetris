const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'FIRST_RENDER':
            return {
                score: 0,
                rows: 0,
                level: 1,
                gameOver: false,
            };
        case 'INCREMENT_LEVEL':
            return {
                ...state,
                level: state.level + 1,
            };
        // case 'update':
        //     return {
        //         ...state,
        //         field: updateField(state.field, action.piece),
        //     };
        default:
            return state;
    }
};

export default reducer;
