const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'start':
            console.log('STARTED GAME STATUS REDUCER');
            return {
                score: 0,
                rows: 0,
                level: 1,
                gameOver: false,
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
